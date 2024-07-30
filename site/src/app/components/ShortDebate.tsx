import { Group, Stack } from "@mantine/core";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import moment from "moment";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import StandardButton from "@/app/components/StandardButton";
import StandardCard from "@/app/components/StandardCard";
import StandardCardSubtitle from "@/app/components/StandardCardSubtitle";
import StandardMarkdown from "@/app/components/StandardMarkdown";

export default function ShortDebate({
  debate,
}: {
  debate: {
    id: number | null;
    title: string | null;
    summary: string | null;
    order_no: number | null;
    sitting_date: string | null;
  };
}) {
  return (
    <StandardCard>
      <Group justify="space-between">
        <StandardCardTitle>{debate.title}</StandardCardTitle>
      </Group>

      <StandardCardSubtitle>
        {moment(debate.sitting_date).format("D MMM YYYY")}
      </StandardCardSubtitle>

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

      <Group grow mt="md">
        <StandardButton colour="blue" href={`/debates/${debate.id}`}>
          Overview
        </StandardButton>
        <StandardButton
          colour="gray"
          href={`https://sprs.parl.gov.sg/search/#/fullreport?sittingdate=${moment(debate.sitting_date).format("DD-MM-YYYY")}`}
        >
          Original source
        </StandardButton>
      </Group>
    </StandardCard>
  );
}
