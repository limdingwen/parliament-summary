import StandardButton from "@/app/components/StandardButton";
import { createClient } from "@/utils/supabase/server";

async function getSecondDebate(billId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("debate_bill_match_view")
    .select("debate_id")
    .eq("bill_id", billId)
    .eq("is_second_reading", true)
    // If there's multiple second readings detected, just ignore it for now...
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? data.debate_id : null;
}

async function getSecondDebateUrl(billId: number) {
  const debateId = await getSecondDebate(billId);
  return debateId ? `/debates/${debateId}` : null;
}

export default async function BillDebateButton({
  bill,
}: {
  bill: { id: number };
}) {
  const secondDebateUrl = await getSecondDebateUrl(bill.id);
  return secondDebateUrl ? (
    <StandardButton colour="gray" href={secondDebateUrl}>
      Debate
    </StandardButton>
  ) : (
    <StandardButton colour="gray" href="#" disabled>
      Debate
    </StandardButton>
  );
}
