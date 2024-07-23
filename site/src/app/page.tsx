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
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";
import Markdown from "react-markdown";

async function getRecentBills() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary",
    )
    .order("date_introduced", { ascending: false });
  if (error) throw error;
  return data;
}

async function RecentBills() {
  return (
    <Center>
      <Stack gap="md" justify="center" align="stretch" maw={800}>
        {(await getRecentBills()).map((bill) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
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

            <Button color="blue" fullWidth mt="md" radius="md">
              View More
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
