import React from "react";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import { ReactComponent as Logo } from "../../../img/hermes-logo.svg";

const styles = StyleSheet.create({
  container: {
    marginLeft: 32,
    marginRight: 32,
  },
  title: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 19,
    lineHeight: "24px",
    letterSpacing: "0.4px",
    color: "#fbf9f9",
    opacity: 0.7,
    marginLeft: 12,
  },
  logo: {
    maxWidth: "100px",
    maxHeight: "100px",
  },
});

function LogoComponent() {
  return (
    <Row
      className={css(styles.container)}
      horizontal="center"
      vertical="center"
    >
      <Logo className={css(styles.logo)}/>
    </Row>
  );
}

export default LogoComponent;
