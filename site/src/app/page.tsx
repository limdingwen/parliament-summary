"use client";

import { AppShell } from "@mantine/core";

export default function Home() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
