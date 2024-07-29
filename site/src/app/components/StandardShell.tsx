"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Burger,
  Group,
  rem,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import classes from "./StandardShell.module.css";
import PageFooter from "@/app/components/PageFooter";
import Link from "next/link";

type PageLink = {
  name: string;
  href: string;
};

function generateButtonsFromLinks(links: PageLink[], closeNavbar: () => void) {
  return links.map(({ name, href }) => (
    <UnstyledButton
      key={href}
      className={classes.control}
      component={Link}
      href={href}
      onClick={closeNavbar}
    >
      {name}
    </UnstyledButton>
  ));
}

export default function StandardShell({
  children,
  logo,
  links,
}: {
  children: React.ReactNode;
  logo: React.ReactNode;
  links: PageLink[];
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });
  const generatedButtons = generateButtonsFromLinks(links, close);

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned, offset: false }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            {logo}
            <Group ml="xl" gap={0} visibleFrom="sm">
              {generatedButtons}
            </Group>
          </Group>
        </Group>
      </AppShellHeader>

      <AppShell.Navbar py="md" px={4}>
        {generatedButtons}
      </AppShell.Navbar>

      <AppShellMain pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {children}
      </AppShellMain>

      <PageFooter />
    </AppShell>
  );
}
