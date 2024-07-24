import StandardButton from "@/app/components/StandardButton";

export default function BillOriginalPdfButton({
  bill,
}: {
  bill: { pdf_url: string };
}) {
  return (
    <StandardButton colour="gray" href={bill.pdf_url}>
      Original PDF
    </StandardButton>
  );
}
