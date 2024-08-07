"use client";

import { Spotlight, SpotlightActionGroupData } from "@mantine/spotlight";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import fetchFromSupabase from "@/utils/fetchFromSupabase";

type ClientFriendlyData = {
  href: string;
  title: string;
};

async function getResults(query: string): Promise<{
  debate: ClientFriendlyData[];
  bill: ClientFriendlyData[];
}> {
  return fetchFromSupabase("search", { query });
}

function convertDataToActions(
  router: AppRouterInstance,
  data: ClientFriendlyData[],
) {
  return data.map((item) => ({
    id: item.href,
    label: item.title,
    onClick: () => router.push(item.href),
  }));
}

function convertResultsToActionGroups(
  router: AppRouterInstance,
  results: {
    debate: ClientFriendlyData[];
    bill: ClientFriendlyData[];
  },
): SpotlightActionGroupData[] {
  return [
    {
      group: "Debates",
      actions: convertDataToActions(router, results.debate),
    },
    {
      group: "Bills",
      actions: convertDataToActions(router, results.bill),
    },
  ];
}

// Empty action groups make nothingFound not work properly, and empty headers ain't that good anyway
function clearEmptyActionGroups(actionGroups: SpotlightActionGroupData[]) {
  return actionGroups.filter((group) => group.actions.length > 0);
}

export default function SearchSpotlight() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<{
    searchHappened: boolean;
    actionGroups: SpotlightActionGroupData[];
  }>({
    searchHappened: false,
    actionGroups: [],
  });

  useEffect(() => {
    let isCanceled = false;
    (async () => {
      if (debouncedQuery != "") {
        const results = await getResults(debouncedQuery);
        if (isCanceled) {
          return;
        }
        setResults({
          searchHappened: true,
          actionGroups: clearEmptyActionGroups(
            convertResultsToActionGroups(router, results),
          ),
        });
      } else {
        setResults({ searchHappened: false, actionGroups: [] });
      }
    })();
    // If the debouncedQuery changes before the request completes, cancel the request's setActions call
    return () => {
      isCanceled = true;
    };
  }, [debouncedQuery]);

  return (
    <Spotlight
      query={query}
      clearQueryOnClose={false}
      onQueryChange={(query) => {
        setQuery(query);
      }}
      actions={results.actionGroups}
      shortcut={null}
      filter={(_, actions) =>
        // Don't filter; search is already done
        actions
      }
      scrollable
      highlightQuery
      nothingFound={
        results.searchHappened ? "No results found" : "Start typing to search"
      }
      radius="lg"
    />
  );
}
