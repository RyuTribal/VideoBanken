import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";
import { withFederated } from "aws-amplify-react";

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

const Buttons = props => (
  <div>
    <button className="social-btn">
      <div>
        <img src="//d35aaqx5ub95lt.cloudfront.net/images/google-color.svg"></img>
        <span className="google-btn">Google</span>
      </div>
    </button>
    <button className="social-btn">
      <div>
        <img src="//d35aaqx5ub95lt.cloudfront.net/images/facebook-blue.svg"></img>
        <span className="fb-btn">Facebook</span>
      </div>
    </button>
  </div>
);

const Federated = withFederated(Buttons);

const federated = {
  google_client_id:
    "216481722641-n8cdp068qrd3ebpi70l2recq8rkj3430.apps.googleusercontent.com", // Enter your google_client_id here
  facebook_app_id: "2711841088850140" // Enter your facebook_app_id here
};

// You can get the current config object
const currentConfig = Auth.configure();

class Login extends Component {
  componentDidMount() {
    $(".icon-wrapper").click(function() {
      $(this)
        .find("i")
        .toggleClass("fa-eye");
      $(this)
        .find("i")
        .toggleClass("fa-eye-slash");
      var input = $($(".toggle-password").attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
  }
  manageLogin() {
    $(".error").css("opacity", "0");
    $('.error').find("p").text()
    var username = $("#username").val();
    var password = $("#password").val();
    Auth.signIn({
      username, // Required, the username
      password // Optional, the password
    })
      .then(user => console.log(user))
      .catch(function(err) {
        console.log(err);
        if (
          err ==
            "AuthError: The username should either be a string or one of the sign in types" ||
          err.message == "null invocation failed due to configuration."
        ) {
          $("input").each(function() {
            if ($(this).val() == "") {
              var nameInput = $(this).attr("name");
              $(this).parent().parent().find('.error').find("p").text("Please enter a " + nameInput);
              $(this)
                .parent()
                .parent()
                .find(".error")
                .css("opacity", "1");
            }
          });
        } else if (
          err.code == "NotAuthorizedException" ||
          err.code == "UserNotFoundException"
        ) {
          $(".error-msg-wrong").css("opacity", "1");
        }
      });
  }

  render() {
    return (
      <div className="login-container">
        <div className="form-container">
          <div className="form">
            <div className="error error-msg-wrong">
              <p>Username and password didn't match</p>
            </div>
            <div class="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="username">
                  Username*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
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
            </div>
            <div class="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="password">
                  Password*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  id="password"
                  type="password"
                  className="form-input password-wrap"
                  name="password"
                />
                <div className="icon-wrapper">
                  <i
                    toggle="#password"
                    className="fas fa-eye toggle-password"
                  ></i>
                </div>
              </div>
            </div>
            <button className="login-btn-confirm" onClick={this.manageLogin}>
              Login
            </button>
            <hr className="hr-text" data-content="or sign in with" />
            <div class="col-md-12">
              <Federated federated={federated} />
            </div>
            <div class="col-md-12">
              <div className="reg-links">
                Don't an account? <Link to="/registration">Register here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
