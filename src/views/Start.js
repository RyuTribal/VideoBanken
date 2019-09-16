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

const currentConfig = Auth.configure();
var that;
class Start extends Component {
  componentWillMount(){
    that = this;
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(function(user) {
        that.props.history.push("/home")
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div id="allWrapper">
        <div className="log-reg-buttons">
          <div className="start-btn">
            <Link className="btn-container login-btn" to="/registration">
              Get started
            </Link>
          </div>
          <div className="start-btn">
            <Link className="btn-container reg-btn" to="/login">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Start;
