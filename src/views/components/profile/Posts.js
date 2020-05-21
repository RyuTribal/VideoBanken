import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
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
  },
});

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      
    };
  }
  componentDidMount = async () => {
    
  };
  componentDidUpdate = async (prevProps) => {
    
  };
  render() {
    return (
      <div className={css(styles.container)}>
        Posts
      </div>
    );
  }
}

export default Posts;