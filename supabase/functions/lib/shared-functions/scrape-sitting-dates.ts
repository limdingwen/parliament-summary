import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import {
  DOMParser,
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.46/deno-dom-wasm.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function getSittingDatesHtml() {
  const url =
    "https://www.parliament.gov.sg/parliamentary-business/votes-and-proceedings";
  const pageSize = "40";
  return (
    await fetch(url, {
      method: "POST",
      body: new URLSearchParams({ PageSize: pageSize }),
    })
  ).text();
}

function parseSittingDates(response: string) {
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
  const containers = doc.querySelectorAll(".indv-votes") as Iterable<Element>;
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

// Scrapes recent bills metadata
// Does not scrape the actual bill text and does not actually summarise them
export default async function scrapeSittingDates(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  console.log("Getting sitting dates HTML from URL...");
  const response = await getSittingDatesHtml();

  console.log("Parsing the downloaded HTML...");
  console.log(response);
  const doc = parseSittingDates(response);

  console.log("Scraping and uploading relevant data...");
  const sittingDates = scrapeFromParsedHtml(doc);
  await uploadSittingDates(supabase, sittingDates);

  return buildResponseProxy({
    message: `Scraped and uploaded the following sitting dates, ignoring any duplication: ${JSON.stringify(sittingDates)}`,
  });
}
