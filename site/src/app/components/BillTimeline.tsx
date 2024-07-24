import { Timeline } from "@mantine/core";
import {
  IconGavel,
  IconLicense,
  IconMessage,
  IconMessagePlus,
  IconThumbUp,
  IconUsersGroup,
} from "@tabler/icons-react";
import moment from "moment";
import React from "react";
import StandardTimelineItem from "@/app/components/StandardTimelineItem";

function firstReadingTimeDescription(date_introduced: string) {
  return moment(date_introduced).fromNow();
}

function secondReadingTimeDescription(
  second_reading_date_type: string,
  second_reading_date: string | null,
) {
  return second_reading_date_type == "explicit"
    ? moment(second_reading_date).fromNow()
    : "Next parliament seating";
}

function thirdReadingTimeDescription(
  is_passed: boolean,
  passed_date: string | null,
) {
  return is_passed ? moment(passed_date).fromNow() : "To be decided";
}

function calculateBillActiveStep(bill: {
  date_introduced: string;
  second_reading_date_type: string;
  second_reading_date: string | null;
  is_passed: boolean;
}) {
  if (bill.is_passed) {
    return 6;
  }

  if (
    bill.second_reading_date_type == "explicit" &&
    moment(bill.second_reading_date) >= moment()
  ) {
    return 3;
  }

  return 1;
}

export default function BillTimeline({
  bill,
}: {
  bill: {
    date_introduced: string;
    second_reading_date_type: string;
    second_reading_date: string | null;
    is_passed: boolean;
    passed_date: string | null;
  };
}) {
  return (
    <Timeline
      pl="xl"
      pr="xl"
      mt="xl"
      active={calculateBillActiveStep(bill)}
      bulletSize={24}
      lineWidth={2}
    >
      <StandardTimelineItem
        bullet={<IconLicense size={12} />}
        title="Bill introduced"
        description="The bill is formally presented in Parliament for consideration."
        timeDescription={firstReadingTimeDescription(bill.date_introduced)}
      />

      <StandardTimelineItem
        bullet={<IconMessage size={12} />}
        title="First reading"
        description="The bill's title and key objectives are read out, but no debate occurs at this stage."
        timeDescription={firstReadingTimeDescription(bill.date_introduced)}
        lineVariant="dashed"
      />

      <StandardTimelineItem
        bullet={<IconMessagePlus size={12} />}
        title="Second reading"
        description="Members of Parliament debate the bill's general principles and overall merits."
        timeDescription={secondReadingTimeDescription(
          bill.second_reading_date_type,
          bill.second_reading_date,
        )}
      />

      <StandardTimelineItem
        bullet={<IconUsersGroup size={12} />}
        title="Select committee"
        description="The bill is examined in detail by a select committee, which may suggest amendments."
        timeDescription={secondReadingTimeDescription(
          bill.second_reading_date_type,
          bill.second_reading_date,
        )}
        lineVariant="dashed"
      />

      <StandardTimelineItem
        bullet={<IconMessagePlus size={12} />}
        title="Third reading"
        description="Members of Parliament debate the final version of the bill, including any amendments made."
        timeDescription={thirdReadingTimeDescription(
          bill.is_passed,
          bill.passed_date,
        )}
      />

      <StandardTimelineItem
        bullet={<IconThumbUp size={12} />}
        title="Voting"
        description="The bill is voted on by the Members of Parliament and, if it receives the required majority, it becomes law. Do note that an exact vote may not be counted; the 'ayes' can simply be louder than the 'noes'."
        timeDescription={thirdReadingTimeDescription(
          bill.is_passed,
          bill.passed_date,
        )}
      />
      <StandardTimelineItem
        bullet={<IconGavel size={12} />}
        title="Bill passed"
        description="The bill is passed and becomes law."
        timeDescription={thirdReadingTimeDescription(
          bill.is_passed,
          bill.passed_date,
        )}
      />
    </Timeline>
  );
}
