import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.46/deno-dom-wasm.ts";
import { createSupabase } from "../create-supabase.ts";
import { buildResponse } from "../build-response.ts";
import { isAdmin } from "../check-admin.ts";

function toIsoDate(dateString: string): string {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

function sanitiseUrl(url: string) {
  return url.split("?")[0].split("#")[0];
}

// Scrapes recent bills metadata
// Does not scrape the actual bill text and does not actually summarise them
Deno.serve(async (req) => {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponse({ message: "Unauthorised." }, 401);
  }

  const billsIntroducedUrl =
    "https://www.parliament.gov.sg/parliamentary-business/bills-introduced";
  const billsIntroducedPaginationSize = "40";
  const billsIntroducedResponse = await fetch(billsIntroducedUrl, {
    method: "POST",
    body: new URLSearchParams({ PageSize: billsIntroducedPaginationSize }),
  });

  const billsIntroducedHtml = await billsIntroducedResponse.text();
  const billsIntroducedDoc = new DOMParser().parseFromString(
    billsIntroducedHtml,
    "text/html",
  );

  let addCount = 0;
  let updateCount = 0;

  const billsIntroduced = billsIntroducedDoc.querySelectorAll(
    ".indv-bill",
  ) as Iterable<Element>;
  for (const billIntroduced of billsIntroduced) {
    const is_second_reading_next_available_seating = billIntroduced
      .querySelector(".indv-bill .row:nth-of-type(2) div:nth-of-type(2)")!
      .textContent.includes("Next Available Sitting");
    const passed_date: string | undefined = billIntroduced
      .querySelector(".indv-bill .row:nth-of-type(2) div:nth-of-type(3)")!
      .textContent.match(/(\d{2}\.\d{2}\.\d{4})/gm)?.[0];

    const scrapedData = {
      bill_no: billIntroduced
        .querySelector(".indv-bill .bill-title div:nth-of-type(2)")!
        .textContent.match(/(\d+\/\d{4})/gm)?.[0]!,
      name: billIntroduced.querySelector("a")?.getAttribute("title")!,
      date_introduced: toIsoDate(
        billIntroduced
          .querySelector(".indv-bill .row:nth-of-type(2) div:nth-of-type(1)")!
          .textContent.match(/(\d{2}\.\d{2}\.\d{4})/gm)?.[0]!,
      ),
      second_reading_date_type: is_second_reading_next_available_seating
        ? "next_available_seating"
        : "explicit",
      second_reading_date: is_second_reading_next_available_seating
        ? null
        : toIsoDate(
            billIntroduced
              .querySelector(
                ".indv-bill .row:nth-of-type(2) div:nth-of-type(2)",
              )!
              .textContent.match(/(\d{2}\.\d{2}\.\d{4})/gm)?.[0]!,
          ),
      is_passed: passed_date !== undefined,
      passed_date: passed_date ? toIsoDate(passed_date) : null,
      pdf_url: sanitiseUrl(
        billIntroduced.querySelector("a")!.getAttribute("href")!,
      ),
      original_text: null,
      summary: null,
    };

    const billExists =
      (await supabase
        .from("bill")
        .select("bill_no")
        .eq("bill_no", scrapedData.bill_no)
        .maybeSingle()) != null;

    if (billExists) {
      // Make sure that we don't overwrite the original_text and summary values
      const {
        original_text: _original_text,
        summary: _summary,
        ...scrapedDataToUpdate
      } = scrapedData;
      const { error } = await supabase
        .from("bill")
        .update(scrapedDataToUpdate)
        .eq("bill_no", scrapedData.bill_no);
      if (error) throw error;
      updateCount++;
    } else {
      const { error } = await supabase.from("bill").insert(scrapedData);
      if (error) throw error;
      addCount++;
    }
  }

  return buildResponse({
    message: `Added ${addCount} new bills and updated ${updateCount} existing bills.`,
  });
});
