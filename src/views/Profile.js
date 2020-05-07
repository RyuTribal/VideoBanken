import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import CoverPhoto from "./components/profile/CoverPhoto";
import { StyleSheet, css } from "aphrodite";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  container: {
    maxWidth: 1250,
    margin: "0 auto",
    height: 1080,
  },
  presentation: {
    height: "30%",
    borderRadius: "20px",
    border: "1px solid #bf9c96",
  },
});

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
    };
  }
  componentDidMount = async () => {
    this.setState({ user: this.props.match.params.user });
    const currentUser = await Auth.currentAuthenticatedUser();
    if (currentUser.username === this.state.user) {
      this.props.onChange("Profil");
    } else {
      this.props.onChange("None");
    }
    console.log(this.state.user);
  };
  componentDidUpdate = async (prevProps, prevState) => {
    if(prevProps.match.params.user !== this.props.match.params.user){
      this.componentDidMount()
    }
  }
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.presentation)}>
          <CoverPhoto user={this.state.user} />
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
