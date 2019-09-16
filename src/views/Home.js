import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";

Amplify.configure(awsconfig);

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: "eu-west-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-1_2Kqz9413g",
    userPoolWebClientId: "7lgiaa2fnd810mh5orp5evuf93"
  }
});
var that;
const currentConfig = Auth.configure();
class Home extends Component {
  componentWillMount() {
    that = this;
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(function(user) {
        $('h1').text("Welcome "+user.username)
      })
      .catch(err => that.props.history.push("/login"));
  }
  manageLogOut(){
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

export default Home;
