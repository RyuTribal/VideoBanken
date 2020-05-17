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
    borderRadius: "20px",
    position: "relative",
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
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: "-23%",
    right: 0,
    left: 0,
  },
});

class CoverPhoto extends Component {
  constructor() {
    super();
    this.state = {
      coverPhoto: null,
      currentUser: false,
      user: ""
    };
  }
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log(currentUser.username)
    console.log(this.props.user)
    if (this.props.user === currentUser.username) {
      this.setState({
        currentUser: true,
        user: this.props.user
      });
    }
  };
  componentDidUpdate = async (prevProps) =>{
    if(prevProps.user !== this.props.user){
      this.componentDidMount();
    }
  }
  changeCover = async () =>{
    
  }
  render() {
    return (
      <div className={css(styles.container)}>
        {this.state.coverPhoto === null ? (
          <div className={css(styles.coverPhoto, styles.None)}>
            <div className={css(styles.profileContainer)}>
              <ProfileImage user={this.state.user} />
            </div>
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
