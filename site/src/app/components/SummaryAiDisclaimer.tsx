import AiDisclaimer from "@/app/components/AiDisclaimer";
import Link from "next/link";
import { Anchor } from "@mantine/core";

export default function SummaryAiDisclaimer() {
  return (
    <AiDisclaimer
      shortExplainer={
        <>
          Summary written by AI (
          <Anchor
            component={Link}
            href="https://github.com/limdingwen/parliament-summary/issues/8"
          >
            edit
          </Anchor>
          )
        </>
      }
      explainer="This summary was written by a cute little robot, but it may not be fully accurate. Please read the original source for the most accurate information. Hopefully, this summary helps you get the gist of it!"
    ></AiDisclaimer>
  );
}
