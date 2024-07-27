"use client";

import { Pagination } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function StandardPagination({
  pageCount,
  page,
}: {
  pageCount: number;
  page: number;
}) {
  const router = useRouter();

  return (
    <Pagination
      mt="xl"
      total={pageCount}
      defaultValue={page}
      withEdges
      onChange={(page) => {
        router.push(`?page=${page}`);
      }}
    />
  );
}
