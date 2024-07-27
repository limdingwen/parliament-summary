import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import { Box, Text } from "@mantine/core";
import React from "react";

export default function PageFooter() {
  return (
    <Box mt="xl" mb="xl" component="footer">
      <HumanFriendlyColumn>
        <Text mt="xs" c="dimmed">
          Disclaimer:
          <br />
          <br />
          The information provided on this webpage is intended for reference
          purposes only. The summaries are generated by artificial intelligence
          and should not be regarded as fully accurate or comprehensive. The
          data is sourced exclusively from publicly available parliamentary
          sources online such as parliament.gov.sg. Users are advised to consult
          original parliamentary documents and official records for precise and
          authoritative information.
        </Text>
      </HumanFriendlyColumn>
    </Box>
  );
}
