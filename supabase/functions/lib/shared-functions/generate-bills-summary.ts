import { createSupabase } from "../utils/create-supabase.ts";
import createOpenAi from "../utils/create-openai.ts";
import { isAdmin } from "../utils/check-admin.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import promptExamplesToMessages from "../utils/prompt-examples-to-messages.ts";
import { summaryBulletPointExamples } from "../sensitive/prompt-examples.ts";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "https://deno.land/x/openai@v4.53.0/resources/chat/completions.ts";

function restrictInputLength(input: string, length: number) {
  return input.length <= length ? input : input.substring(0, length);
}

export default async function generateBillsSummary(req: Request) {
  const supabase = createSupabase();
  const openai = createOpenAi();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  // Generate the summary for the most recent bills first because we assume they are the most important
  const { data: row_with_null_summary, error: selectError } = await supabase
    .from("bill")
    .select("id, original_text, summary")
    .not("original_text", "is", null)
    .is("summary", null)
    .order("date_introduced", { ascending: false })
    .order("bill_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (selectError) throw selectError;
  if (!row_with_null_summary) {
    return buildResponseProxy({ message: "No bills need summary generation." });
  }

  console.log(
    `Attempting to generate summary for bill from row ID ${row_with_null_summary.id}...`,
  );
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. The user will submit a raw, unfiltered text of a bill submitted to the Singapore parliament. Please SUMMARIZE the bill into a THREE to FIVE CONCISE bullet points. The bullet points must be FLAT (there should NOT be headers and sub-bullet points).",
      },
    ]
      .concat(promptExamplesToMessages(summaryBulletPointExamples))
      .concat([
        {
          role: "user",
          // The input length limit is 256,000 characters for GPT 4o mini, independent of the token limit
          content: restrictInputLength(
            row_with_null_summary.original_text!,
            256000,
          ),
        },
      ]) as (
      | ChatCompletionAssistantMessageParam
      | ChatCompletionUserMessageParam
      | ChatCompletionSystemMessageParam
    )[],
    model: "gpt-4o-mini",
  });

  const summary = response.choices[0].message.content;
  console.log(`Summary generated: ${summary}`);

  const { error: updateError } = await supabase
    .from("bill")
    .update({ summary })
    .eq("id", row_with_null_summary.id);
  if (updateError) throw updateError;

  return buildResponseProxy({
    message: `Added generated summary to row ID ${row_with_null_summary.id}.`,
  });
}
