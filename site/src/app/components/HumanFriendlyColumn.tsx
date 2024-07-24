import { Box, Center } from "@mantine/core";
import React from "react";

export default function HumanFriendlyColumn({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Center>
      <Box maw={800}>{children}</Box>
    </Center>
  );
}
