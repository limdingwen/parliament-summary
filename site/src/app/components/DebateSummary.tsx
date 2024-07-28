import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import { Stack } from "@mantine/core";
import Markdown from "react-markdown";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import React from "react";

export default function DebateSummary({
  debate,
}: {
  debate: { summary: string | null };
}) {
  return (
    <StandardCard>
      <StandardCardTitle>Summary</StandardCardTitle>

      <StandardCardDescription>
        {debate.summary ? (
          <Stack>
            <Markdown>{debate.summary}</Markdown>
            <SummaryAiDisclaimer />
          </Stack>
        ) : (
          <SummaryNotAvailableApology />
        )}
      </StandardCardDescription>
    </StandardCard>
  );
}
