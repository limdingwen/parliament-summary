import { Card } from "@mantine/core";
import React from "react";

export default function StandardCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {children}
    </Card>
  );
}
