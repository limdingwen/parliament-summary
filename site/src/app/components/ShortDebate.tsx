import { Group, Stack } from "@mantine/core";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import moment from "moment";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import Markdown from "react-markdown";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import StandardButton from "@/app/components/StandardButton";
import StandardCard from "@/app/components/StandardCard";
import StandardCardSubtitle from "@/app/components/StandardCardSubtitle";

export default function ShortDebate({
  debate,
}: {
  debate: {
    id: number;
    title: string;
    summary: string | null;
    sitting: {
      sitting_date: {
        sitting_date: string;
      } | null;
    } | null;
  };
}) {
  return (
    <StandardCard>
      <Group justify="space-between">
        <StandardCardTitle>{debate.title}</StandardCardTitle>
      </Group>

      <StandardCardSubtitle>
        {moment(debate.sitting!.sitting_date!.sitting_date).format(
          "D MMM YYYY",
        )}
      </StandardCardSubtitle>

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

      <Group grow mt="md">
        <StandardButton colour="blue" href={`/debates/${debate.id}`}>
          Overview
        </StandardButton>
        <StandardButton
          colour="gray"
          href={`https://sprs.parl.gov.sg/search/#/fullreport?sittingdate=${moment(debate.sitting!.sitting_date!.sitting_date).format("DD-MM-YYYY")}`}
        >
          Original source
        </StandardButton>
      </Group>
    </StandardCard>
  );
}
