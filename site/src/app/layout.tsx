import type { Metadata } from "next";
import React from "react";
import "./globals.css";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider, Text } from "@mantine/core";
import StandardShell from "@/app/components/StandardShell";

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.SITE_NAME}`,
    default: process.env.SITE_NAME!,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultColorScheme = "auto";
  const logo = <Text>Parliament Summary</Text>;
  const links = [
    { name: "Bills", href: "/bills" },
    { name: "Debates", href: "/debates" },
  ];

  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={defaultColorScheme} />
      </head>
      <body>
        <MantineProvider defaultColorScheme={defaultColorScheme}>
          <StandardShell logo={logo} links={links}>
            {children}
          </StandardShell>
        </MantineProvider>
      </body>
    </html>
  );
}
