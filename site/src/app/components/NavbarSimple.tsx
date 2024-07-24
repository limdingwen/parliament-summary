"use client";

import { useState } from "react";
import { Group, Title, Container } from "@mantine/core";
import {
  IconBellRinging,
  IconZoom,
  IconGavel,
  IconMessage2Question,
  IconDatabase,
  IconInfoCircle,
} from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";

const data = [
  { link: "", label: "Find MP", icon: IconZoom },
  { link: "", label: "My alerts", icon: IconBellRinging },
  { link: "", label: "Bills", icon: IconGavel },
  { link: "", label: "Q&A", icon: IconMessage2Question },
];

export function NavbarSimple() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Container fluid>
            <Title>ParlSum</Title>
          </Container>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconInfoCircle className={classes.linkIcon} stroke={1.5} />
          <span>About us</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconDatabase className={classes.linkIcon} stroke={1.5} />
          <span>Raw data</span>
        </a>
      </div>
    </div>
  );
}