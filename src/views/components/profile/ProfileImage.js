import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import blankProfile from "../../../img/blank-profile.png";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    position: "relative",
    borderRadius: "50%",
    border: "5px solid #fbf9f9",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  changeImage: {
    position: "absolute",
    background: "#fbf9f9",
    width: 35,
    height: 35,
    bottom: "5%",
    right: "3%",
    borderRadius: "50%",
    color: "#263040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
  },
});

class ProfileImage extends Component {
  constructor() {
    super();
    this.state = {
      profileImage: null,
      currentUser: false,
      user: ""
    };
  }
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log(currentUser.username);
    console.log(this.props.user);
    if (this.props.user === currentUser.username) {
      this.setState({
        currentUser: true,
        user: this.props.user,
      });
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.componentDidMount();
    }
  };
  render() {
    return (
      <div className={css(styles.container)}>
        <img src={blankProfile} className={css(styles.profileImage)}></img>
        {this.state.currentUser === true && (
          <div className={css(styles.changeImage)}>
            <i className="fas fa-camera"></i>
          </div>
        )}
      </div>
    );
  }
}

export default ProfileImage;
