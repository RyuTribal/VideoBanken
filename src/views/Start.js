import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import $ from "jquery";
class Start extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        this.props.history.push("/home")
      })
      .catch(err => {
        this.props.history.push("/login")
      });
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
