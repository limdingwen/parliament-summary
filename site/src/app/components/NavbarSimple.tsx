import {
  IconBellRinging,
  IconZoom,
  IconGavel,
  IconMessage2Question,
  IconCodeDots,
  IconInfoCircle,
} from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";

const data = [
  { link: "/findmp", label: "Find MP", icon: IconZoom },
  { link: "/alerts", label: "My alerts", icon: IconBellRinging },
  { link: "/bills", label: "Bills", icon: IconGavel },
  { link: "/qa", label: "Q&A", icon: IconMessage2Question },
];

export function NavbarSimple() {
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={false}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="/aboutus" className={classes.link}>
          <IconInfoCircle className={classes.linkIcon} stroke={1.5} />
          <span>About us</span>
        </a>

        <a href="/developer" className={classes.link}>
          <IconCodeDots className={classes.linkIcon} stroke={1.5} />
          <span>Developer</span>
        </a>
      </div>
    </div>
  );
}
