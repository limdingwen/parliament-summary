import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import { Stack } from "@mantine/core";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import React from "react";
import StandardMarkdown from "@/app/components/StandardMarkdown";

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
            <StandardMarkdown>{debate.summary}</StandardMarkdown>
            <SummaryAiDisclaimer />
          </Stack>
        ) : (
          <SummaryNotAvailableApology />
        )}
      </StandardCardDescription>
    </StandardCard>
  );
}
