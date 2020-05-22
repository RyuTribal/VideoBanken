import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";
import { withFederated } from "aws-amplify-react";
import HermesLogo from "../img/hermes-logo.svg";
const Buttons = (props) => (
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
  facebook_app_id: "2711841088850140", // Enter your facebook_app_id here
};

function validate(username, password) {
  return {
    username: username.length === 0,
    password: password.length === 0,
  };
}

// You can get the current config object
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      everFocusedUsername: false,
      everFocusedPassword: false,
      inFocus: "",
      touched: {
        username: false,
        password: false,
      },
      usernameErrorMessage: "Detta fält kan inte vara tomt",
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      usernameError: false,
      passwordError: false,
      uniError: false,
      loading: false,
    };
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        this.props.history.push("/home");
      })
      .catch((err) => {});
  }
  shouldMarkError = (field) => {
    const hasError = validate(this.state.username, this.state.password)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value, uniError: false });
  };

  handlePasswordChange = (evt) => {
    this.setState({ password: evt.target.value, uniError: false });
  };

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };

  canBeSubmitted = () => {
    const errors = validate(this.state.username, this.state.password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };

  checkForEnter = (e) => {
    if (e.key === "Enter") {
      this.manageLogin();
    }
  };
  manageLogin = (evt) => {
    this.setState({
      loading: true,
    });
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }
    const username = this.state.username;
    const password = this.state.password;
    Auth.signIn({
      username, // Required, the username
      password, // Optional, the password
    })
      .then((user) => {
        this.props.history.push("/home");
      })
      .catch((err) => {
        if (
          err ==
            "AuthError: The username should either be a string or one of the sign in types" ||
          err.message == "null invocation failed due to configuration."
        ) {
          this.setState({
            usernameError: true,
            usernameErrorMessage: "Detta fält kan inte vara tomt",
            passwordError: true,
            passwordErrorMessage: "Detta fält kan inte vara tomt",
            loading: false,
          });
        } else if (
          err.code == "NotAuthorizedException" ||
          err.code == "UserNotFoundException"
        ) {
          console.log("Hey");
          this.setState({
            usernameError: false,
            passwordError: false,
            uniError: true,
            loading: false,
          });
        }
      });
  };

  render() {
    const errors = validate(this.state.username, this.state.password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h2>Logga in</h2>
          </div>
          <div className="form-container">
            {this.state.uniError === true && (
              <p className="universal-input-error">
                Användarnamnet och lösenordet matchar inte
              </p>
            )}
            <div className="input-wrappers">
              <lable for="username">Användarnamn</lable>
              <input
                type="text"
                className={
                  this.shouldMarkError("username") ||
                  this.state.usernameError === true
                    ? "input-error custom-input"
                    : "custom-input"
                }
                id="username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
                onBlur={this.handleBlur("username")}
                onKeyDown={this.checkForEnter}
                autoFocus
              ></input>
              {this.state.usernameError ||
                (this.shouldMarkError("username") && (
                  <p className="input-error-message">
                    {this.state.usernameErrorMessage}
                  </p>
                ))}
            </div>
            <div className="input-wrappers">
              <lable for="password">Lösenord</lable>
              <input
                type="password"
                className={
                  this.shouldMarkError("password") ||
                  this.state.passwordError === true
                    ? "input-error custom-input"
                    : "custom-input"
                }
                id="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                onBlur={this.handleBlur("password")}
                onKeyDown={this.checkForEnter}
              ></input>
              {this.state.passwordError ||
                (this.shouldMarkError("password") && (
                  <p className="input-error-message">
                    {this.state.passwordErrorMessage}
                  </p>
                ))}
              <Link to="password-reset">Glömt lösenordet?</Link>
            </div>
            <button
              disabled={isDisabled || this.state.loading}
              type="submit"
              className="login-button"
              onClick={() => this.manageLogin()}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Logga in"
              )}
            </button>
            <div class="separator">eller</div>
            <Federated federated={federated} />
          </div>
          <div className="login-link">
            ObiWan <Link to="registration">Skapa ett här</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
