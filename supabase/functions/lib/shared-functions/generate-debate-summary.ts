import { createSupabase } from "../utils/create-supabase.ts";
import createOpenAi from "../utils/create-openai.ts";
import { isAdmin } from "../utils/check-admin.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import { TextContentBlock } from "https://deno.land/x/openai@v4.53.0/resources/beta/threads/messages.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

function restrictInputLength(input: string, length: number) {
  return input.length <= length ? input : input.substring(0, length);
}

async function getDebateNeedingSummary(supabase: SupabaseClient) {
  // Generate the summary for the most recent debates first because we assume they are the most important
  const { data, error } = await supabase
    .from("debate")
    .select("id, order_no, summary, sitting ( sitting_date ( sitting_date ) )")
    .is("summary", null)
    .order("sitting_date", {
      ascending: false,
      referencedTable: "sitting.sitting_date",
    })
    .order("order_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getDebateSpeechInputForAi(
  supabase: SupabaseClient,
  debateId: number,
) {
  const { data, error } = await supabase
    .from("debate_speech")
    .select("speaker_name, content")
    .eq("debate_id", debateId)
    .order("order_no", { ascending: true });
  if (error) throw error;
  return data
    .map((speech) => `${speech.speaker_name}: ${speech.content}`)
    .join("\n\n");
}

export default async function generateDebateSummary(req: Request) {
  const supabase = createSupabase();
  const openai = createOpenAi();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  const debate = await getDebateNeedingSummary(supabase);
  if (!debate) {
    return buildResponseProxy({
      message: "No debates need summary generation.",
    });
  }

  console.log(`Creating AI-friendly input of debate speeches...`);
  const debateSpeechInput = await getDebateSpeechInputForAi(
    supabase,
    debate.id,
  );
  console.log(`AI-friendly input created: ${debateSpeechInput}`);

  console.log(
    `Attempting to generate summary for debate from row ID ${debate.id}...`,
  );
  const run = await openai.beta.threads.createAndRunPoll({
    assistant_id: Deno.env.get("OPENAI_DEBATE_SUMMARY_ASSISTANT_ID")!,
    thread: {
      messages: [
        {
          role: "user",
          // The input length limit is 256,000 characters for GPT 4o mini, independent of the token limit
          content: restrictInputLength(debateSpeechInput, 256000),
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
      .from("debate")
      .update({ summary })
      .eq("id", debate.id);
    if (updateError) throw updateError;

    return buildResponseProxy({
      message: `Added generated summary to row ID ${debate.id}.`,
    });
  } else {
    throw new Error(
      `Summary generation failed. The run dump is as follows: ${JSON.stringify(run)}`,
    );
  }
}
