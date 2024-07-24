import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import ShortBill from "@/app/components/ShortBill";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";

export const runtime = "edge";

async function getRecentBills() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary, pdf_url",
    )
    .order("date_introduced", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

export default async function RecentBills() {
  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle
          title="Recent Bills"
          subtitle="Bills, including constitutional amendments, are proposals to change Singapore's laws. A bill needs a majority to pass, while amendments require a two-thirds majority. Below are the most recent proposals."
        />

        {(await getRecentBills()).map((bill) => (
          <ShortBill key={bill.bill_no} bill={bill} />
        ))}
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
