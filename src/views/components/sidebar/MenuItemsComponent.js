import React from "react";
import { bool, func, string, nominalTypeHack } from "prop-types";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";

const styles = StyleSheet.create({
  activeBar: {
    height: 56,
    width: "100%",
    position: "absolute",
    left: 0,
    background: "#1e2633",
  },
  activeTarget: {
    right: -2,
    color: "#fbf9f9",
    position: "absolute",
    fontSize: 40,
    border: "none",
  },
  activeTitle: {
    color: "#ea3a3a",
    opacity: 1,
    zIndex: 1,
  },
  container: {
    height: 56,
    cursor: "pointer",
    ":hover i": {
      opacity: "1",
    },
    ":hover span": {
      opacity: "1",
    },
    paddingLeft: 32,
    paddingRight: 32,
  },
  title: {
    fontSize: 16,
    lineHeight: "20px",
    letterSpacing: "0.2px",
    color: "#fbf9f9",
    opacity: "0.7",
    marginLeft: 24,
    transition: "0.4s",
    textTransform: "uppercase",
  },
  icon: {
    color: "#fbf9f9",
    opacity: "0.7",
    transition: "0.4s",
  },
  link: {
    ":hover": {
      textDecoration: "none",
    },
    ":focus": {
      textDecoration: "none",
    },
  },
});

function MenuItemComponent(props) {
  const { active, icon, title, link, ...otherProps } = props;
  return (
    <Link className={css(styles.link)} to={link}>
      <Row className={css(styles.container)} vertical="center" {...otherProps}>
        {active && <div className={css(styles.activeBar)}></div>}
        <i
          className={`${css(
            styles.icon,
            active && styles.activeTitle
          )} ${icon}`}
          fill={active && "#DDE2FF"}
          opacity={!active && "0.4"}
        ></i>
        <span className={css(styles.title, active && styles.activeTitle)}>
          {title}
        </span>
      </Row>
    </Link>
  );
}

MenuItemComponent.propTypes = {
  active: bool,
  icon: string,
  title: string,
};

export default MenuItemComponent;