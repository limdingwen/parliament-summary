import buildResponseProxy from "../utils/build-response-proxy.ts";
import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function getDebateSpeechRows(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("debate_speech")
    .select("id, speaker_name")
    .is("speaker_id", null);
  if (error) throw error;
  return data;
}

async function fetchSpeakerIdWithSpeakerName(
  supabase: SupabaseClient,
  speakerName: string,
) {
  const { data, error } = await supabase
    .from("combined_mp_names_view")
    .select("mp_id")
    .or(`full_name.eq."${speakerName}", alias_name.eq."${speakerName}"`)
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const result = data ? data.mp_id : null;
  console.log(`Found speaker ID for ${speakerName}: ${result}`);

  return result;
}

async function updateDebateSpeechRowWithSpeakerId(
  supabase: SupabaseClient,
  rowId: number,
  speakerId: number,
) {
  const { error } = await supabase
    .from("debate_speech")
    .update({ speaker_id: speakerId })
    .eq("id", rowId);
  if (error) throw error;
}

// Goes through all debate speeches and fills in the speaker_id field via the speaker_name field
// This is to enable dynamic aliasing without needing to re-scrape the entire database
export default async function fillDebateSpeakerIds(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  let rowCount = 0;

  const debateSpeechRows = await getDebateSpeechRows(supabase);

  for (const row of debateSpeechRows) {
    const speakerId = await fetchSpeakerIdWithSpeakerName(
      supabase,
      row.speaker_name,
    );

    // We assume that we are only working with speakerId = null rows, so if speakerId is still null,
    // don't bother updating it.
    if (speakerId) {
      await updateDebateSpeechRowWithSpeakerId(supabase, row.id, speakerId);
      rowCount++;
    }
  }

  return buildResponseProxy({
    message: `Filled speaker IDs for ${rowCount} debate speeches.`,
  });
}
