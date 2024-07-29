import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import Markdown from "react-markdown";
import React from "react";
import { Text } from "@mantine/core";
import StandardMarkdown from "./StandardMarkdown";

function formatProcText(content: string) {
  return content
    .replaceAll("[(proc text) ", "*")
    .replaceAll(" (proc text)]", "*");
}

export default function DebateSummary({
  debateSpeech,
}: {
  debateSpeech: { speaker_name: string | null; content: string };
}) {
  return (
    <StandardCard>
      {debateSpeech.speaker_name ? (
        <>
          <StandardCardTitle>{debateSpeech.speaker_name}</StandardCardTitle>
          <StandardCardDescription>
            <Markdown>{formatProcText(debateSpeech.content)}</Markdown>
          </StandardCardDescription>
        </>
      ) : (
        <Text size="sm" component="div">
          <StandardMarkdown>
            {formatProcText(debateSpeech.content)}
          </StandardMarkdown>
        </Text>
      )}
    </StandardCard>
  );
}
