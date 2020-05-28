import React, { Component } from "react";
import { string } from "prop-types";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import blankProfile from "../../../img/blank-profile.png";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginLeft: 14,
    border: "1px solid #bf9c96",
  },
  container: {
    height: 40,
    padding: 30,
    paddingTop: 30,
    color: "#263040",
    zIndex: 99
  },
  cursorPointer: {
    cursor: "pointer",
  },
  name: {
    fontFamily: "",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "20px",
    textAlign: "right",
    letterSpacing: 0.2,
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  separator: {
    borderLeft: "1px solid #bf9c96",
    marginLeft: 32,
    marginRight: 32,
    height: 32,
    width: 2,
    "@media (max-width: 321px)": {
      marginLeft: 15,
      marginRight: 10,
    },
  },
  title: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "30px",
    letterSpacing: 0.3,
    "@media (max-width: 768px)": {
      marginLeft: 36,
    },
    "@media (max-width: 468px)": {
      fontSize: 20,
    },
  },
  iconStyles: {
    cursor: "pointer",
    marginLeft: 25,
    "@media (max-width: 768px)": {
      marginLeft: 12,
    },
  },
  link: {
    color: "#263040",
    ":hover": {
      textDecoration: "none",
      color: "#263040",
    },
  },
});

class HeaderComponent extends Component {
  onItemClick = (item) => {
    return this.props.onChange(item);
  };
  render() {
    return (
      <Row
        className={css(styles.container)}
        vertical="center"
        horizontal="space-between"
      >
        <span className={css(styles.title)}>{this.props.title}</span>
        <Row vertical="center">
          <div className={css(styles.iconStyles)}>
            <i className="fas fa-search"></i>
          </div>
          <div className={css(styles.iconStyles)}>
            <i className="fas fa-bell"></i>
          </div>
          <div
            onClick={this.props.videoModal}
            className={css(styles.iconStyles)}
          >
            <i className="fas fa-video"></i>
          </div>
          <div className={css(styles.separator)}></div>
          <Row
            active={this.props.selectedItem === "Profil"}
            onClick={() => this.onItemClick("Profil")}
            vertical="center"
          >
            <Link
              className={css(styles.link)}
              to={`/home/users/${this.props.username}`}
            >
              <span className={css(styles.name, styles.cursorPointer)}>
                {this.props.usernickname}
              </span>
              <img
                src={blankProfile}
                alt="avatar"
                className={css(styles.avatar, styles.cursorPointer)}
              />
            </Link>
          </Row>
        </Row>
      </Row>
    );
  }
}

export default withRouter(HeaderComponent);
