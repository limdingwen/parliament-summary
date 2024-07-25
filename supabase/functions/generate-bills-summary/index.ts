import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createSupabase } from "../create-supabase.ts";
import { isAdmin } from "../check-admin.ts";
import { buildResponse } from "../build-response.ts";
import createOpenAi from "../create-openai.ts";
import { TextContentBlock } from "https://deno.land/x/openai@v4.53.0/resources/beta/threads/messages.ts";

function restrictInputLength(input: string, length: number) {
  return input.length <= length ? input : input.substring(0, length);
}

Deno.serve(async (req) => {
  const supabase = createSupabase();
  const openai = createOpenAi();

  if (!isAdmin(req)) {
    return buildResponse({ message: "Unauthorised." }, 401);
  }

  // Generate the summary for the most recent bills first because we assume they are the most important
  const { data: row_with_null_summary, error: selectError } = await supabase
    .from("bill")
    .select("id, original_text, summary")
    .not("original_text", "is", null)
    .is("summary", null)
    .order("date_introduced", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (selectError) throw selectError;
  if (!row_with_null_summary)
    return buildResponse({ message: "No bills need summary generation." });

  console.log(
    `Attempting to generate summary for bill from row ID ${row_with_null_summary.id}...`,
  );
  const run = await openai.beta.threads.createAndRunPoll({
    assistant_id: Deno.env.get("OPENAI_BILL_SUMMARY_ASSISTANT_ID")!,
    thread: {
      messages: [
        {
          role: "user",
          // The input length limit is 256,000 characters for GPT 4o mini, independent of the token limit
          content: restrictInputLength(
            row_with_null_summary.original_text!,
            256000,
          ),
        },
      ],
    },
  });

  if (run.status == "completed") {
    const responses = await openai.beta.threads.messages.list(run.thread_id, {
      run_id: run.id,
    });
    const summary = (responses.data[0].content[0] as TextContentBlock).text
      .value;
    console.log(`Summary generated: ${summary}`);

    const { error: updateError } = await supabase
      .from("bill")
      .update({ summary })
      .eq("id", row_with_null_summary.id);
    if (updateError) throw updateError;

    return buildResponse({
      message: `Added generated summary to row ID ${row_with_null_summary.id}.`,
    });
  } else {
    throw new Error(
      `Summary generation failed. The run dump is as follows: ${JSON.stringify(run)}`,
    );
  }
});
