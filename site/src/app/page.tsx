"use client";

import { AppShell } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

export default async function Home() {
  const supabase = createClient();
  const test = await supabase.from("bill").select();

  return (
    <AppShell padding="md">
      <AppShell.Main>Hello world! :) {JSON.stringify(test)}</AppShell.Main>
    </AppShell>
  );
}
