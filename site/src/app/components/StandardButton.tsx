import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function StandardButton({
  colour,
  href,
  children,
  disabled = false,
}: {
  colour: string;
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      color={colour}
      radius="md"
      component={Link}
      href={href}
    >
      {children}
    </Button>
  );
}
