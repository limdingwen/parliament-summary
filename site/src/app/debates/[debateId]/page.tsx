import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import React from "react";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import { Metadata } from "next";
import moment from "moment";
import DebateSummary from "@/app/components/DebateSummary";
import DebateSpeechCard from "@/app/components/DebateSpeechCard";

export const runtime = "edge";

const subtitle = (debate: {
  sitting: { sitting_date: { sitting_date: string } | null } | null;
}) =>
  `Debated in Parliament on ${moment(debate.sitting!.sitting_date!.sitting_date).format("D MMM YYYY")}.`;

export async function generateMetadata({
  params,
}: {
  params: { debateId: string };
}): Promise<Metadata> {
  const debate = await getDebate(parseInt(params.debateId));

  return {
    title: debate.title,
    description: subtitle(debate),
  };
}

async function getDebate(debateId: number) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("debate")
    .select("id, title, summary, sitting ( sitting_date ( sitting_date ) )")
    .eq("id", debateId)
    .single();
  if (error) throw error;
  return data;
}

async function getDebateSpeeches(debateId: number) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("debate_speech")
    .select("speaker_name, content")
    .eq("debate_id", debateId)
    .order("order_no", { ascending: true });
  if (error) throw error;
  return data;
}

export default async function FullBill({
  params,
}: {
  params: { debateId: string };
}) {
  const debate = await getDebate(parseInt(params.debateId));
  const debateSpeeches = await getDebateSpeeches(parseInt(params.debateId));

  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle title={debate.title} subtitle={subtitle(debate)} />

        <DebateSummary debate={debate} />

        {debateSpeeches.map((debateSpeech, index) => (
          <DebateSpeechCard key={index} debateSpeech={debateSpeech} />
        ))}
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
