import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Timeline,
  TimelineItem,
} from "@mantine/core";
import Markdown from "react-markdown";
import PageTitle from "@/app/components/PageTitle";
import {
  IconThumbUp,
  IconLicense,
  IconMessage,
  IconGavel,
  IconMessagePlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import moment from "moment/moment";
import AiDisclaimer from "@/app/components/AiDisclaimer";
import Link from "next/link";
import React from "react";

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
    <Center>
      <Stack gap="md" justify="center" align="stretch" maw={800}>
        <PageTitle
          title={bill.name}
          subtitle={`Explore the details of bill number ${bill.bill_no}.`}
        />

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Text fw="semibold">Summary</Text>
          </Group>

          <Text mt="xs" size="sm" c="dimmed" component="div">
            {bill.summary ? (
              <Stack>
                <Markdown>{bill.summary}</Markdown>
                <Group justify="space-between">
                  <AiDisclaimer
                    shortExplainer="Summary written by AI"
                    explainer="This summary was written by a cute little robot, but it may not be fully accurate. Please read the original PDF for the most accurate information. Hopefully, this summary helps you get the gist of it!"
                  ></AiDisclaimer>
                  <Button
                    color="gray"
                    radius="md"
                    component={Link}
                    href={bill.pdf_url}
                  >
                    Original PDF
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Group justify="space-between">
                We're processing this bill's summary right now! Check back soon.
                <Button
                  color="gray"
                  radius="md"
                  component={Link}
                  href={bill.pdf_url}
                >
                  Original PDF
                </Button>
              </Group>
            )}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Text fw="semibold">Timeline</Text>
          </Group>
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
        </Card>
      </Stack>
    </Center>
  );
}
