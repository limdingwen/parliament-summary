import React from "react";
import { Text, TimelineItem } from "@mantine/core";

export default function StandardTimelineItem({
  bullet,
  title,
  description,
  timeDescription,
  lineVariant,
}: {
  bullet: React.ReactNode;
  title: string;
  description: string;
  timeDescription: string;
  lineVariant?: "solid" | "dashed" | "dotted" | undefined;
}) {
  return (
    <TimelineItem bullet={bullet} title={title} lineVariant={lineVariant}>
      <Text c="dimmed" size="sm">
        {description}
      </Text>
      <Text size="xs" mt={4}>
        {timeDescription}
      </Text>
    </TimelineItem>
  );
}
