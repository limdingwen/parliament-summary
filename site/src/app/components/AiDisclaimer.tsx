import { IconRobot } from "@tabler/icons-react";
import { Group, Text, Tooltip } from "@mantine/core";

export default function AiDisclaimer({
  shortExplainer,
  explainer,
}: {
  shortExplainer: string;
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
