import { createSupabase } from "../utils/create-supabase.ts";
import createOpenAi from "../utils/create-openai.ts";
import { isAdmin } from "../utils/check-admin.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";
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
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. The user will submit a raw, unfiltered text of a debate from the Singapore parliament. Please SUMMARIZE the debate into a THREE to FIVE CONCISE bullet points. The bullet points must be FLAT (there should NOT be headers and sub-bullet points). BOLD words that are important for a quick scan.",
      },
    ]
      .concat(promptExamplesToMessages(summaryBulletPointExamples))
      .concat([
        {
          role: "user",
          // The input length limit is 256,000 characters for GPT 4o mini, independent of the token limit
          content: restrictInputLength(debateSpeechInput, 256000),
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
    .from("debate")
    .update({ summary })
    .eq("id", debate.id);
  if (updateError) throw updateError;

  return buildResponseProxy({
    message: `Added generated summary to row ID ${debate.id}.`,
  });
}
