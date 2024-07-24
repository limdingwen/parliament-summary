import { Text } from "@mantine/core";
import React from "react";

export default function StandardCardTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text fw="semibold">{children}</Text>;
}
