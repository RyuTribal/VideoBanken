import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import $ from "jquery";
var that;
class HomeFeed extends Component {
  componentDidMount(prevProps) {
    that = this;
    console.log(this.props)
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(function(user) {
        console.log(user);
        $("h1").text("Welcome " + user.username);
      })
      .catch(err => that.props.history.push("/login"));
  }
  manageLogOut() {
    Auth.signOut()
      .then(data => that.props.history.push("/login"))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div>
        <h1></h1>
        <button onClick={this.manageLogOut}>Logout</button>
      </div>
    );
  }
}

export default HomeFeed;
