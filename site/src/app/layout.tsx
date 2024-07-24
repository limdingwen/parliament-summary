import type { Metadata } from "next";
import React from "react";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";

export const metadata: Metadata = {
  title: "Parliament Summary",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md">
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultColorScheme = "auto";

  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={defaultColorScheme} />
      </head>
      <body>
        <MantineProvider defaultColorScheme={defaultColorScheme}>
          <Shell>{children}</Shell>
        </MantineProvider>
      </body>
    </html>
  );
}
