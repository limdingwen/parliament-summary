import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import {
  DOMParser,
  type Element,
  type HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.46/deno-dom-wasm.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function getOrderPapersHtml() {
  const url =
    "https://www.parliament.gov.sg/parliamentary-business/order-paper";
  const pageSize = "40";
  return (
    await fetch(`${url}?pageSize=${pageSize}`)
  ).text();
}

function parseOrderPapers(response: string) {
  return new DOMParser().parseFromString(response, "text/html");
}

function scrapeRawStringFromContainer(container: Element) {
  return container.querySelector(".xs-boxgap")!.textContent;
}

function parseRawStringToIsoDate(rawString: string) {
  const rawDateString = rawString
    .trim()
    .match(/Sitting on (\d{1,2} \w+ \d{4})/gm)![0];
  const date = moment(rawDateString, "D MMM YYYY");
  return date.toISOString();
}

function scrapeFromParsedHtml(doc: HTMLDocument) {
  const containers = doc.querySelectorAll(".indv-votes");
  return Array.from(containers).map((container) => {
    const rawString = scrapeRawStringFromContainer(container);
    const sittingDate = parseRawStringToIsoDate(rawString);
    return {
      sitting_date: sittingDate,
    };
  });

}

async function uploadSittingDates(
  supabase: SupabaseClient,
  sittingDates: { sitting_date: string }[],
) {
  const { error } = await supabase.from("sitting_date").upsert(sittingDates, {
    onConflict: "sitting_date",
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

// Scrapes recent order papers metadata
// Does not scrape the actual order papers text and does not actually summarise them
export default async function scrapeOrderPaperDates(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  console.log("Getting order paper HTML from URL...");
  const response = await getOrderPapersHtml();

  console.log("Parsing the downloaded HTML...");
  console.log(response);
  const doc = parseOrderPapers(response);

  console.log("Scraping and uploading relevant data...", doc);
  const sittingDates = scrapeFromParsedHtml(doc);
  await uploadSittingDates(supabase, sittingDates);

  return buildResponseProxy({
    message: `Scraped and uploaded the following sitting dates from the order papers, ignoring any duplication: ${JSON.stringify(sittingDates)}`,
  });
}
