import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import ShortBill from "@/app/components/ShortBill";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import type { Metadata } from "next";
import StandardPagination from "@/components/StandardPagination";
import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import StandardButton from "@/app/components/StandardButton";
import { Group } from "@mantine/core";

export const runtime = "edge";

const title = "Recent Bills";
const subtitle =
  "Bills, including constitutional amendments, are proposals to change Singapore's laws. A bill needs a majority to pass, while amendments require a two-thirds majority. Below are the most recent proposals.";

const itemsPerPage = parseInt(process.env.ITEMS_PER_PAGE!);

export const metadata: Metadata = {
  title,
  description: subtitle,
};

// First and last are both assumed inclusive as per Supabase API.
function calculatePaginationOffset(page: number) {
  const first = (page - 1) * itemsPerPage;
  const last = first + itemsPerPage - 1;
  return [first, last];
}

async function getRecentBills(page: number) {
  const supabase = createClient();
  const [first, last] = calculatePaginationOffset(page);
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary, pdf_url",
    )
    .order("date_introduced", { ascending: false })
    .order("bill_no", { ascending: false })
    .range(first, last);
  if (error) throw error;
  return data;
}

async function getBillCount() {
  const supabase = createClient();
  const { error, count } = await supabase
    .from("bill")
    .select("id", { count: "exact" })
    .limit(0);
  if (error) throw error;
  return count!;
}

export default async function RecentBills({
  searchParams,
}: {
  searchParams: { page: string | undefined };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const billCount = await getBillCount();
  const pageCount = Math.ceil(billCount / itemsPerPage);
  const isLastPage = page === pageCount;

  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle title={title} subtitle={subtitle} />

        {(await getRecentBills(page)).map((bill) => (
          <ShortBill key={bill.bill_no} bill={bill} />
        ))}

        {isLastPage && (
          <StandardCard>
            <StandardCardTitle>View More Bills</StandardCardTitle>
            <StandardCardDescription>
              You've reached the end of our list of parliament bill summaries.
              Due to technical constraints, we can only provide summaries for a
              limited number of bills. To see more bills, visit the original
              source.
            </StandardCardDescription>
            <Group mt="md" grow>
              <StandardButton
                colour="gray"
                href="https://www.parliament.gov.sg/parliamentary-business/bills-introduced"
              >
                Visit original source
              </StandardButton>
            </Group>
          </StandardCard>
        )}

        <StandardPagination pageCount={pageCount} page={page} />
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
