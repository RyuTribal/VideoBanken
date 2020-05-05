import React from "react";
import { bool, func, string, nominalTypeHack } from "prop-types";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import { Link } from "react-router-dom";

const styles = StyleSheet.create({
  activeBar: {
    height: 56,
    width: 3,
    position: "absolute",
    left: 0,
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
});

function MenuItemComponent(props) {
  const { active, icon, title, link, ...otherProps } = props;
  return (
    <Row className={css(styles.container)} vertical="center" {...otherProps}>
      <Link to={link}>
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
        {active && (
          <i className={`fas fa-caret-left ${css(styles.activeTarget)}`}></i>
        )}
      </Link>
    </Row>
  );
}

MenuItemComponent.propTypes = {
  active: bool,
  icon: func,
  title: string,
};

export default MenuItemComponent;
