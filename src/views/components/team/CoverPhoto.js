import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  container: {
    height: "100%",

    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  coverPhoto: {
    height: "100%",
    minHeight: "20vw",
    width: "100%",
    position: "relative",
    display: "flex",
    cursor: "pointer",
  },
  None: {
    backgroundColor: "#263040",
  },
  changeCover: {
    position: "absolute",
    background: "#fbf9f9",
    width: 35,
    height: 35,
    bottom: "5%",
    right: "3%",
    borderRadius: 5,
    color: "#263040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
  },
  profileImageContainer: {
    flex: "2",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  equalizer: {
    flex: "5",
    display: "flex",
    width: "100%",
    "@media (max-width: 813px)": {
      display: "none",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "none",
    },
  },
});

class CoverPhoto extends Component {
  constructor() {
    super();
    this.state = {
      coverPhoto: null,
      currentUser: false,
      user: "",
    };
  }
  componentDidMount = async () => {

  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.componentDidMount();
    }
  };
  changeCover = async () => {};
  render() {
    return (
      <div className={css(styles.container)}>
        {this.state.coverPhoto === null ? (
          <div className={css(styles.coverPhoto, styles.None)}>
          </div>
        ) : (
          <img
            src={this.state.coverPhoto}
            className={css(styles.coverPhoto)}
          ></img>
        )}
        {this.state.currentUser === true && (
          <div className={css(styles.changeCover)}>
            <i className="fas fa-camera"></i>
          </div>
        )}
      </div>
    );
  }
}

export default CoverPhoto;
