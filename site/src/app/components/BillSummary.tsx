import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import { Group, Stack } from "@mantine/core";
import Markdown from "react-markdown";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import BillOriginalPdfButton from "@/app/components/BillOriginalPdfButton";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import React from "react";

export default function BillSummary({
  bill,
}: {
  bill: { summary: string | null; pdf_url: string };
}) {
  return (
    <StandardCard>
      <StandardCardTitle>Summary</StandardCardTitle>

      <StandardCardDescription>
        {bill.summary ? (
          <Stack>
            <Markdown>{bill.summary}</Markdown>
            <Group justify="space-between">
              <SummaryAiDisclaimer />
              <BillOriginalPdfButton bill={bill} />
            </Group>
          </Stack>
        ) : (
          <Group justify="space-between">
            <SummaryNotAvailableApology />
            <BillOriginalPdfButton bill={bill} />
          </Group>
        )}
      </StandardCardDescription>
    </StandardCard>
  );
}
