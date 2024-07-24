import { Box, Title, Text } from "@mantine/core";

export default function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Box mt="lg" mb="lg">
      <Title>{title}</Title>
      {subtitle && (
        <Text fw="semibold" mt="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
