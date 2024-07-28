import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import Markdown from "react-markdown";
import React from "react";

export default function DebateSummary({
  debateSpeech,
}: {
  debateSpeech: { speaker_name: string | null; content: string };
}) {
  return (
    <StandardCard>
      {debateSpeech.speaker_name && (
        <StandardCardTitle>{debateSpeech.speaker_name}</StandardCardTitle>
      )}
      <StandardCardDescription>
        <Markdown>{debateSpeech.content}</Markdown>
      </StandardCardDescription>
    </StandardCard>
  );
}
