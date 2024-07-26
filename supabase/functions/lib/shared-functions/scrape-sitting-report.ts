import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.46/deno-dom-wasm.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import { format } from "https://deno.land/std@0.224.0/datetime/mod.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function insertSpeech(
  supabase: SupabaseClient,
  orderNo: number,
  debateId: number,
  content: string,
) {
  const debateSpeechData = {
    order_no: orderNo,
    debate_id: debateId,
    content: content,
  };
  const { error: insertDebateSpeechError } = await supabase
    .from("debate_speech")
    .insert(debateSpeechData);
  if (insertDebateSpeechError) throw insertDebateSpeechError;
  console.log(`Inserted debate speech ${JSON.stringify(debateSpeechData)}.`);
}

// Scrapes an entire sitting's report and fills out the database
export default async function scrapeSittingReport(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  console.log("Getting sitting dates that need scraping...");
  const { data: unscrapedDateData, error: unscrapedDateError } = await supabase
    .from("unscraped_sitting_dates_view")
    .select("id, sitting_date")
    .limit(1)
    .maybeSingle();
  if (unscrapedDateError) throw unscrapedDateError;
  if (!unscrapedDateData) {
    return buildResponseProxy({ message: "No sitting dates need scraping." });
  }
  console.log(`${unscrapedDateData.sitting_date} needs scraping.`);

  console.log("Getting sitting report JSON from URL...");
  const sittingReportUrl = "https://sprs.parl.gov.sg/search/getHansardReport/";
  const sittingReportFormattedDate = format(
    new Date(unscrapedDateData.sitting_date),
    "dd-MM-yyyy",
  );
  const sittingReportRequestParams = new URLSearchParams({
    sittingDate: sittingReportFormattedDate,
  });
  const sittingReportResponse = await fetch(
    sittingReportUrl + "?" + sittingReportRequestParams,
  );
  const sittingReport = await sittingReportResponse.json();

  console.log("Scraping sitting report metadata...");
  const parliamentNo = sittingReport.metadata.parlimentNO;
  const sessionNo = sittingReport.metadata.sessionNO;
  const volumeNo = sittingReport.metadata.volumeNO;
  const sittingNo = sittingReport.metadata.sittingNO;
  const sittingReportMetadata = {
    sitting_date_id: unscrapedDateData.id,
    parliament_no: parliamentNo,
    session_no: sessionNo,
    volume_no: volumeNo,
    sitting_no: sittingNo,
  };
  const { data: sittingId, error: insertSittingMetadataError } = await supabase
    .from("sitting")
    .insert(sittingReportMetadata)
    .select("id")
    .single();
  if (insertSittingMetadataError) throw insertSittingMetadataError;
  console.log(
    `Inserted sitting metadata ${JSON.stringify(sittingReportMetadata)} with ID ${sittingId.id}.`,
  );

  let debateCount = 0;
  let debateSpeechCount = 0;

  let debateOrderNo = 0;
  for (const sittingReportItem of sittingReport.takesSectionVOList) {
    console.log("Scraping debate...");
    const debateTitle = sittingReportItem.title;
    // TODO: Add bill linkage
    const debateData = {
      order_no: debateOrderNo,
      sitting_id: sittingId.id,
      title: debateTitle,
    };
    debateOrderNo++;

    const { data: debateId, error: insertDebateError } = await supabase
      .from("debate")
      .insert(debateData)
      .select("id")
      .single();
    if (insertDebateError) throw insertDebateError;
    console.log(
      `Inserted debate ${JSON.stringify(debateData)} with ID ${debateId.id}.`,
    );
    debateCount++;

    console.log("Scraping debate speeches...");
    const debateContentHtml = sittingReportItem.content;
    const debateContent = new DOMParser().parseFromString(
      debateContentHtml,
      "text/html",
    );
    const paragraphs = debateContent.querySelectorAll("p") as Iterable<Element>;

    // We build up the content buffer until a speaker's name is mentioned in the paragraph's <strong> tag
    // which we assume means that another speech has started. We then insert the content buffer into the database, which
    // crucially does not include the current paragraph (which is part of the next speech).
    //
    // We insert the content buffer one last time after the loop ends to ensure that the last speech is inserted.
    // Also, beware not to insert an empty contentBuffer (e.g. if the first paragraph has a speaker's name).
    let contentBuffer = "";
    let debateSpeechOrderNo = 0;
    for (const paragraph of paragraphs) {
      const speaker = paragraph.querySelector("strong")?.textContent;
      const content = paragraph.textContent;
      if (speaker && contentBuffer.trim() != "") {
        console.log("Speaker name detected, inserting speech...");
        await insertSpeech(
          supabase,
          debateSpeechOrderNo,
          debateId.id,
          contentBuffer,
        );
        debateSpeechCount++;

        contentBuffer = "";
      }

      // If there's nothing, then don't insert the paragraph break
      contentBuffer += (contentBuffer == "" ? "" : "\n\n") + content;
    }
    if (contentBuffer.trim() != "") {
      console.log("Inserting last speech...");
      await insertSpeech(
        supabase,
        debateSpeechOrderNo,
        debateId.id,
        contentBuffer,
      );
      debateSpeechCount++;
    }
  }

  return buildResponseProxy({
    message: `Inserted sitting ${JSON.stringify(sittingReportMetadata)} with ${debateCount} debates and ${debateSpeechCount} speeches.`,
  });
}
