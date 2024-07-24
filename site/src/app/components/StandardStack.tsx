import { Stack } from "@mantine/core";
import React from "react";

export default function StandardStack({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack gap="md" justify="center" align="stretch">
      {children}
    </Stack>
  );
}
