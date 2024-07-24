import {
  AppShell,
  AppShellMain,
  Badge,
  Button,
  Card,
  Group,
  Text,
  Stack,
  Center,
  Title,
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";
import Markdown from "react-markdown";
import Link from "next/link";

export const runtime = "edge";

function flipBillNo(billNo: string) {
  const [billOfYear, year] = billNo.split("/");
  return `${year}/${billOfYear}`;
}

async function getRecentBills() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary",
    )
    .order("date_introduced", { ascending: false });
  if (error) throw error;
  return data;
}

async function RecentBills() {
  return (
    <Center>
      <Stack gap="md" justify="center" align="stretch" maw={800}>
        <Title>Recent Bills</Title>

        {(await getRecentBills()).map((bill) => (
          <Card
            key={bill.bill_no}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group justify="space-between">
              <Text fw="semibold">{bill.name}</Text>
              {bill.is_passed ? (
                <Badge color="gray">
                  Passed {moment(bill.passed_date).fromNow()}
                </Badge>
              ) : (
                <Badge color="pink">
                  {bill.second_reading_date_type == "explicit"
                    ? `Reading ${moment(bill.second_reading_date).fromNow()}`
                    : "Reading during next seating"}
                </Badge>
              )}
            </Group>

            <Text mt="xs" size="sm" c="dimmed" component="div">
              {bill.summary ? (
                <Markdown>{bill.summary}</Markdown>
              ) : (
                "We're processing this bill's summary right now! Check back soon."
              )}
            </Text>

            <Button
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              component={Link}
              href={`/bills/${flipBillNo(bill.bill_no)}`}
            >
              View more
            </Button>
          </Card>
        ))}
      </Stack>
    </Center>
  );
}

export default async function Home() {
  return (
    <AppShell padding="md">
      <AppShellMain>
        <RecentBills />
      </AppShellMain>
    </AppShell>
  );
}
