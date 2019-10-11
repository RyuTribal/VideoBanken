import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";
import { withFederated } from "aws-amplify-react";

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
var that;
class Login extends Component {
  componentWillMount() {
    that = this;
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(function(user) {
        that.props.history.push("/home");
      })
      .catch(function() {
        $("input").keyup(function(event) {
          if (event.keyCode === 13) {
            $(".login-btn-confirm").click();
          }
        });
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
      });
  }
  manageLogin() {
    $(".error").css("opacity", "0");
    $(".error")
      .find("p")
      .text();
    var username = $("#username").val();
    var password = $("#password").val();
    Auth.signIn({
      username, // Required, the username
      password // Optional, the password
    })
      .then(user => that.props.history.push("/home"))
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
              $(this)
                .parent()
                .parent()
                .find(".error")
                .find("p")
                .text("Please enter a " + nameInput);
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
          <h2 className="form-title">Sign in</h2>
          <div className="form">
            <div className="error error-msg-wrong">
              <p>Username and password didn't match</p>
            </div>
            <div className="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="username">
                  Username*:
                </label>
              </div>
              <div className="field-wrapper">
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
            <div className="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="password">
                  Password*:{" "}
                  <Link className="forgot-info" to="password-reset">
                    {" "}
                    Forgot password?
                  </Link>
                </label>
              </div>
              <div className="field-wrapper">
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <button className="login-btn-confirm" onClick={this.manageLogin}>
              Login
            </button>
            <hr className="hr-text" data-content="or sign in with" />
            <div className="col-md-12">
              <Federated federated={federated} />
            </div>
            <div className="col-md-12">
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
