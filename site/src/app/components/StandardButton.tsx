"use client";

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
  const handleButtonDisabledClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
    e.preventDefault();

  return (
    <Button
      disabled={disabled}
      onClick={disabled ? handleButtonDisabledClick : undefined}
      color={colour}
      radius="md"
      component={Link}
      href={href}
    >
      {children}
    </Button>
  );
}
