import { createClient } from "@/utils/supabase/client";
import { Text, Timeline, TimelineItem } from "@mantine/core";
import PageTitle from "@/app/components/PageTitle";
import {
  IconGavel,
  IconLicense,
  IconMessage,
  IconMessagePlus,
  IconThumbUp,
  IconUsersGroup,
} from "@tabler/icons-react";
import moment from "moment/moment";
import React from "react";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import BillSummary from "@/app/components/billSummary";

export const runtime = "edge";

function buildBillNoFromBillPath(year: string, billNoOfYear: string) {
  return `${billNoOfYear}/${year}`;
}

async function getBill(billNo: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, summary, pdf_url, date_introduced, second_reading_date_type, second_reading_date, is_passed, passed_date",
    )
    .eq("bill_no", billNo)
    .single();
  if (error) throw error;
  return data;
}

export default async function FullBill({
  params,
}: {
  params: { year: string; billNoOfYear: string };
}) {
  const bill = await getBill(
    buildBillNoFromBillPath(params.year, params.billNoOfYear),
  );

  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle
          title={bill.name}
          subtitle={`Explore the details of bill number ${bill.bill_no}.`}
        />

        <BillSummary bill={bill} />

        <StandardCard>
          <StandardCardTitle>Timeline</StandardCardTitle>
          <Timeline
            pl="xl"
            pr="xl"
            mt="xl"
            active={3}
            bulletSize={24}
            lineWidth={2}
          >
            <TimelineItem
              bullet={<IconLicense size={12} />}
              title="Bill introduced"
            >
              <Text c="dimmed" size="sm">
                The bill is formally presented in Parliament for consideration.
              </Text>
              <Text size="xs" mt={4}>
                {moment(bill.date_introduced).fromNow()}
              </Text>
            </TimelineItem>

            <TimelineItem
              bullet={<IconMessage size={12} />}
              title="First reading"
              lineVariant="dashed"
            >
              <Text c="dimmed" size="sm">
                The bill's title and key objectives are read out, but no debate
                occurs at this stage.
              </Text>
              <Text size="xs" mt={4}>
                {moment(bill.date_introduced).fromNow()}
              </Text>
            </TimelineItem>

            <TimelineItem
              title="Second reading"
              bullet={<IconMessagePlus size={12} />}
            >
              <Text c="dimmed" size="sm">
                Members of Parliament debate the bill's general principles and
                overall merits.
              </Text>
              <Text size="xs" mt={4}>
                {bill.second_reading_date_type == "explicit"
                  ? moment(bill.second_reading_date).fromNow()
                  : "Next parliament seating"}
              </Text>
            </TimelineItem>

            <TimelineItem
              title="Select committee"
              bullet={<IconUsersGroup size={12} />}
              lineVariant="dashed"
            >
              <Text c="dimmed" size="sm">
                The bill is examined in detail by a select committee, which may
                suggest amendments.
              </Text>
              <Text size="xs" mt={4}>
                {bill.second_reading_date_type == "explicit"
                  ? moment(bill.second_reading_date).fromNow()
                  : "Next parliament seating"}
              </Text>
            </TimelineItem>

            <TimelineItem
              title="Third reading"
              bullet={<IconMessagePlus size={12} />}
            >
              <Text c="dimmed" size="sm">
                Members of Parliament debate the final version of the bill,
                including any amendments made.
              </Text>
              <Text size="xs" mt={4}>
                {bill.is_passed
                  ? moment(bill.passed_date).fromNow()
                  : "To be decided"}
              </Text>
            </TimelineItem>

            <TimelineItem title="Voting" bullet={<IconThumbUp size={12} />}>
              <Text c="dimmed" size="sm">
                The bill is voted on by the Members of Parliament and, if it
                receives the required majority, it becomes law. Do note that an
                exact vote may not be counted; the "ayes" can simply be louder
                than the "noes".
              </Text>
              <Text size="xs" mt={4}>
                {bill.is_passed
                  ? moment(bill.passed_date).fromNow()
                  : "To be decided"}
              </Text>
            </TimelineItem>

            <TimelineItem title="Bill passed" bullet={<IconGavel size={12} />}>
              <Text c="dimmed" size="sm">
                The bill is passed and becomes law.
              </Text>
              <Text size="xs" mt={4}>
                {bill.is_passed
                  ? moment(bill.passed_date).fromNow()
                  : "To be decided"}
              </Text>
            </TimelineItem>
          </Timeline>
        </StandardCard>
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
