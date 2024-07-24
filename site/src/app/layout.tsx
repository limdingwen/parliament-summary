import type { Metadata } from "next";
import React from "react";
import "./globals.css";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";
import { NavbarSimple } from "@/app/components/NavbarSimple";

export const metadata: Metadata = {
  title: "Parliament Summary",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      // navbar={{
      //   width: 300,
      //   breakpoint: "sm",
      // }}
      padding="md"
    >
      {/*<AppShellNavbar p="md">*/}
      {/*  <NavbarSimple />*/}
      {/*</AppShellNavbar>*/}

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
