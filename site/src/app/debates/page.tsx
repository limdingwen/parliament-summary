import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import type { Metadata } from "next";
import StandardPagination from "@/app/components/StandardPagination";
import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import StandardButton from "@/app/components/StandardButton";
import { Group } from "@mantine/core";
import ShortDebate from "@/app/components/ShortDebate";

export const runtime = "edge";

const title = "Recent Debates";
const subtitle =
  "Explore the latest parliamentary debates, where Members of Parliament discuss key issues and proposed legislation in detail. Stay informed about the topics shaping Singapore's laws and policies, and access the official records in the Hansard.";

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

async function getRecentDebates(page: number) {
  const supabase = createClient();
  const [first, last] = calculatePaginationOffset(page);
  const { data, error } = await supabase
    .from("debate")
    .select(
      "id, title, order_no, summary, sitting ( sitting_date ( sitting_date ) )",
    )
    .order("sitting_date", {
      ascending: false,
      referencedTable: "sitting.sitting_date",
    })
    .order("order_no", { ascending: false })
    .range(first, last);
  if (error) throw error;
  return data;
}

async function getDebateCount() {
  const supabase = createClient();
  const { error, count } = await supabase
    .from("debate")
    .select("id", { count: "exact" })
    .limit(0);
  if (error) throw error;
  return count!;
}

export default async function RecentDebates({
  searchParams,
}: {
  searchParams: { page: string | undefined };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const debateCount = await getDebateCount();
  const pageCount = Math.ceil(debateCount / itemsPerPage);
  const isLastPage = page === pageCount;

  return (
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle title={title} subtitle={subtitle} />

        {(await getRecentDebates(page)).map((debate) => (
          <ShortDebate key={debate.id} debate={debate} />
        ))}

        {isLastPage && (
          <StandardCard>
            <StandardCardTitle>View More Debates</StandardCardTitle>
            <StandardCardDescription>
              You&apos;ve reached the end of our list of parliament debate
              summaries. Due to technical constraints, we can only provide
              summaries for a limited number of debates. To see more debates,
              visit the original source.
            </StandardCardDescription>
            <Group mt="md" grow>
              <StandardButton
                colour="gray"
                href="https://sprs.parl.gov.sg/search/#/home"
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
