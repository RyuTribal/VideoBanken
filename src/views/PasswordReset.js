import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";

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

class PasswordReset extends Component {
  managePassword() {
    $(".error").css("opacity", "0");
    $(".error")
      .find("p")
      .text();
    var username = $("#username").val();
    Auth.forgotPassword(username)
      .then(function(data){
        
      })
      .catch(function(err) {
        if (err) {
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .find("p")
            .text("User doesn't exist");
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .css("opacity", "1");
        }
      });
  }
  render() {
    return (
      <div className="login-container">
        <div className="form-container">
        <h2 className="form-title">Reset password</h2>
          <div className="form">
            <div class="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="username">
                  Username*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  name="username"
                  placeholder="eg. TheTerminator2008"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <button className="login-btn-confirm" onClick={this.managePassword}>
              Send Code
            </button>
            <hr className="hr-text" data-content="or" />
            <div className="reg-links">
                <Link to="/registration">Create a new account here</Link>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;
