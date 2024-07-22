import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createSupabase } from "../create-supabase.ts";
import { buildResponse } from "../build-response.ts";
import * as pdfjs from "../lib/pdfjs/pdf.mjs";
import * as pdfjsworker from "../lib/pdfjs/pdf.worker.mjs";

// Just a reference to force the import of the worker, otherwise it will not be included in the bundle
// noinspection JSUnusedLocalSymbols
type p = typeof pdfjsworker;
pdfjs.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

async function extractTextFromPdf(pdfUrl: string) {
  const response = await fetch(pdfUrl);

  const task = pdfjs.getDocument({ data: await response.arrayBuffer() });
  const data = await task.promise;
  if (!data) throw new Error("Error parsing PDF");

  let output = "";
  for (let i = 1; i <= data.numPages; i++) {
    const page = await data.getPage(i);
    const textContent = await page.getTextContent({
      includeMarkedContent: false,
    });
    const text = textContent.items
      .map((item: { str: string }) => item.str)
      .join("\n");
    output += text;
  }

  return output;
}

// Only scrapes one bill's text (via PDF) to avoid overloading the server
// Will check the database if any bill's text needs scraping (i.e. still null)
// Run this function on a schedule to scrape all bills
Deno.serve(async () => {
  const supabase = createSupabase();

  const { data: row_with_null_text, error: selectError } = await supabase
    .from("bill")
    .select("id, pdf_url")
    .is("original_text", null)
    .limit(1)
    .maybeSingle();
  if (selectError) throw selectError;
  if (!row_with_null_text)
    return buildResponse({ message: "No bills need PDF text scraping." });

  const extractedText = await extractTextFromPdf(row_with_null_text.pdf_url);
  const { error: updateError } = await supabase
    .from("bill")
    .update({ original_text: extractedText })
    .eq("id", row_with_null_text.id);
  if (updateError) throw updateError;

  return buildResponse({ extractedText });
});
