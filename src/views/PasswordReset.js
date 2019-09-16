import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import slick from "../commercial/slick/slick";
import { blockStatement } from "@babel/types";

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
      .then(function(data) {
        $('#code-comf').css("display", "block");
        $('#username-comf').css("display", "none");
      })
      .catch(function(err) {
        console.log(err)
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
          <div id="username-comf" className="form">
            <div className="col-md-12">
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
            <div id="code-comf" className="col-md-12">
              <p>
                You will recieve a code to your email. Enter the code sent here
              </p>
              <p>
                If you didn't recieve the code,{" "}
                <Link>click here to resend.</Link>
              </p>
              <div className="label-error-wrapper">
                <label className="input-label" for="code">
                  Code*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="code"
                  className="form-input"
                  name="code"
                  placeholder="eg. 123345"
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
