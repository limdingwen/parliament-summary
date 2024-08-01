import { Text } from "@mantine/core";
import React from "react";

export default function StandardCardSubtitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text mt="xs" size="sm" c="dimmed" component="div">
      {children}
    </Text>
  );
}
