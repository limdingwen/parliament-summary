import { Text } from "@mantine/core";
import React from "react";

export default function StandardCardDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text mt="xs" size="sm" component="div">
      {children}
    </Text>
  );
}
