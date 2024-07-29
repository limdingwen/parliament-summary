import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import { Box } from "@mantine/core";
import StandardCardDescription from "./StandardCardDescription";
import StandardCardTitle from "./StandardCardTitle";
import StandardCard from "./StandardCard";
import React from "react";

export default function PageFooter() {
  return (
    <Box mt="xl" mb="xl" p="md" component="footer">
      <HumanFriendlyColumn>
        <StandardCard>
          <StandardCardTitle>Disclaimer</StandardCardTitle>
          <StandardCardDescription>
            The information provided on this webpage is intended for reference
            purposes only. The summaries are generated by artificial
            intelligence and should not be regarded as fully accurate or
            comprehensive. The data is sourced exclusively from publicly
            available parliamentary sources online such as parliament.gov.sg.
            Users are advised to consult original parliamentary documents and
            official records for precise and authoritative information.
          </StandardCardDescription>
        </StandardCard>
      </HumanFriendlyColumn>
    </Box>
  );
}
