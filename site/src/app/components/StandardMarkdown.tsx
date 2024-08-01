import Markdown from "react-markdown";
import { Box } from "@mantine/core";
import React from "react";

export default function StandardMarkdown({ children }: { children: string }) {
  return (
    <Box>
      <Markdown>{children}</Markdown>
    </Box>
  );
}
