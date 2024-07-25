import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import ShortBill from "@/app/components/ShortBill";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import type { Metadata } from "next";

export const runtime = "edge";

const title = "Recent Bills";
const subtitle =
  "Bills, including constitutional amendments, are proposals to change Singapore's laws. A bill needs a majority to pass, while amendments require a two-thirds majority. Below are the most recent proposals.";

export const metadata: Metadata = {
  title,
  description: subtitle,
};

async function getRecentBills() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary, pdf_url",
    )
    .order("date_introduced", { ascending: false })
    .order("bill_no", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

export default async function RecentBills() {
  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle title={title} subtitle={subtitle} />

        {(await getRecentBills()).map((bill) => (
          <ShortBill key={bill.bill_no} bill={bill} />
        ))}
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
