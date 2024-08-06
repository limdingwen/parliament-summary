import { IconRobot } from "@tabler/icons-react";
import { Group, Text, Tooltip } from "@mantine/core";
import React from "react";

export default function AiDisclaimer({
  shortExplainer,
  explainer,
}: {
  shortExplainer: React.ReactNode;
  explainer: string;
}) {
  return (
    <Group>
      <Tooltip
        label={explainer}
        multiline
        withArrow
        transitionProps={{ duration: 200 }}
        events={{ hover: true, focus: false, touch: true }}
        w={200}
      >
        <IconRobot />
      </Tooltip>

      <Text size="sm" c="dimmed">
        {shortExplainer}
      </Text>
    </Group>
  );
}
