import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function StandardButton({
  colour,
  href,
  children,
}: {
  colour: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button color={colour} radius="md" component={Link} href={href}>
      {children}
    </Button>
  );
}
