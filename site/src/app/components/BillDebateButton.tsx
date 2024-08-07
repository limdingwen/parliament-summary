import StandardButton from "@/app/components/StandardButton";
import fetchFromSupabase from "@/utils/fetchFromSupabase";

async function getSecondDebateId(billId: number) {
  const response = (await fetchFromSupabase("fetch-debate-from-bill", {
    billId,
  })) as { debateId: number | null };
  return response.debateId;
}

async function getSecondDebateUrl(billId: number) {
  const debateId = await getSecondDebateId(billId);
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
