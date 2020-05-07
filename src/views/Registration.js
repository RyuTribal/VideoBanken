import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import $ from "jquery";
import intlTelInput from "intl-tel-input/build/js/intlTelInput";
import utils from "intl-tel-input/build/js/utils";
import { withFederated } from "aws-amplify-react";
function validate(username, password, name, email) {
  return {
    username: username.length === 0,
    password: password.length === 0,
    name: name.length === 0,
    email: email.length === 0,
  };
}
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
class Registration extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      name: "",
      email: "",
      everFocusedUsername: false,
      everFocusedPassword: false,
      everFocusedName: false,
      everFocusedEmail: false,
      inFocus: "",
      touched: {
        username: false,
        password: false,
        name: false,
        email: false,
      },
      usernameErrorMessage: "Detta fält kan inte vara tomt",
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      addressErrorMessage: "Detta fält kan inte vara tomt",
      nameErrorMessage: "Detta fält kan inte vara tomt",
      emailErrorMessage: "Detta fält kan inte vara tomt",
      usernameError: false,
      passwordError: false,
      nameError: false,
      emailError: false,
      hidden: true,
      loading: false,
      btnDisable: false,
      userCreated: false,
    };
  }
  componentWillMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        this.props.history.push("/home");
      })
      .catch((err) => {});
  }

  shouldMarkError = (field) => {
    const hasError = validate(
      this.state.username,
      this.state.password,
      this.state.name,
      this.state.email
    )[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value });
    const format = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(evt.target.value)) {
      this.setState({
        usernameError: true,
        usernameErrorMessage:
          "Användarnamnet får bara ha special tecken - och _",
        btnDisable: true,
      });
    } else {
      this.setState({
        usernameError: false,
        usernameErrorMessage: "Detta fält kan inte vara tomt",
        btnDisable: false,
      });
    }
  };

  handlePasswordChange = (evt) => {
    this.setState({ password: evt.target.value });
    if (this.state.password.length < 8) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: "Lösenordet måste vara minst 8 tecken lång",
      });
    } else if (this.state.password.length >= 8) {
      this.setState({
        passwordError: false,
        passwordErrorMessage: "Detta fält kan inte vara tomt",
      });
    }
  };

  handleNameChange = (evt) => {
    this.setState({ name: evt.target.value });
  };
  handleEmailChange = (evt) => {
    this.setState({ email: evt.target.value });
    if (!evt.target.value.match(/.+@.+/)) {
      this.setState({
        emailError: true,
        emailErrorMessage: "Skriv in ett giltigt email",
        btnDisable: true,
      });
    } else {
      this.setState({
        emailError: false,
        emailErrorMessage: "Detta fält kan inte vara tomt",
        btnDisable: false,
      });
    }
  };

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };

  canBeSubmitted = () => {
    const errors = validate(
      this.state.username,
      this.state.password,
      this.state.name,
      this.state.email
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };

  checkForEnter = (e) => {
    if (e.key === "Enter") {
      this.manageReg();
    }
  };

  toggleHide = () => {
    if (this.state.hidden === true) {
      this.setState({
        hidden: false,
      });
    } else if (this.state.hidden === false) {
      this.setState({
        hidden: true,
      });
    }
  };

  manageReg = async () => {
    this.setState({
      loading: true,
    });
    var username = this.state.username;
    var name = this.state.name;
    var email = this.state.email;
    var password = this.state.password;
    await Auth.signUp({
      username: username,
      password: password,
      attributes: {
        nickname: name,
        email: email,
      },
    })
      .then((user) => {
        this.props.history.push("login")
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        console.log(err);
        if (
          err.message == "Error creating account" ||
          err.message == "Username cannot be empty" ||
          err.message == "PreSignUp failed with error x is not defined."
        ) {
          this.setState({
            usernameError: true,
            usernameErrorMessage: "Detta fält kan inte vara tomt",
          });
        } else if (err.message == "User already exists") {
          this.setState({
            usernameError: true,
            usernameErrorMessage:
              "Ett konto med detta användarnamet existerar redan",
          });
        } else if (
          err.message == "PreSignUp failed with error u is not defined."
        ) {
          this.setState({
            usernameError: true,
            usernameErrorMessage:
              "Användarnamnet får bara ha special tecken - och _",
          });
        } else if (err.message == "Invalid email address format.") {
          this.setState({
            emailError: true,
            emailErrorMessage: "Skriv in ett giltigt email",
          });
        }
      });
  };
  render() {
    const errors = validate(
      this.state.username,
      this.state.password,
      this.state.name,
      this.state.email
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h2>Registrera</h2>
          </div>
          <div className="form-container">
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
              {this.shouldMarkError("username") || this.state.usernameError ? (
                <p className="input-error-message">
                  {this.state.usernameErrorMessage}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="input-wrappers">
              <lable for="name">Namn</lable>
              <input
                type="text"
                className={
                  this.shouldMarkError("name") || this.state.nameError === true
                    ? "input-error custom-input"
                    : "custom-input"
                }
                id="name"
                value={this.state.name}
                onChange={this.handleNameChange}
                onBlur={this.handleBlur("name")}
                onKeyDown={this.checkForEnter}
              ></input>
              {this.state.nameError ||
                (this.shouldMarkError("name") && (
                  <p className="input-error-message">
                    {this.state.nameErrorMessage}
                  </p>
                ))}
            </div>
            <div className="input-wrappers">
              <lable for="email">Email</lable>
              <input
                type="email"
                className={
                  this.shouldMarkError("email") ||
                  this.state.emailError === true
                    ? "input-error custom-input"
                    : "custom-input"
                }
                id="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                onBlur={this.handleBlur("email")}
                onKeyDown={this.checkForEnter}
              ></input>
              {this.shouldMarkError("email") || this.state.emailError ? (
                <p className="input-error-message">
                  {this.state.emailErrorMessage}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="input-wrappers">
              <lable for="password">Lösenord</lable>
              <div
                className={`input-icon ${
                  this.shouldMarkError("password") ||
                  this.state.passwordError === true
                    ? "input-error"
                    : ""
                }`}
              >
                <input
                  type={this.state.hidden === true ? "password" : "text"}
                  className="custom-input"
                  id="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  onBlur={this.handleBlur("password")}
                  onKeyDown={this.checkForEnter}
                ></input>
                <button
                  onClick={() => this.toggleHide()}
                  className="confirmPassword"
                >
                  <i
                    className={
                      this.state.hidden === true
                        ? "fas fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </button>
              </div>
              {this.shouldMarkError("password") || this.state.passwordError ? (
                <p className="input-error-message">
                  {this.state.passwordErrorMessage}
                </p>
              ) : (
                ""
              )}
            </div>
            <button
              disabled={
                isDisabled || this.state.loading || this.state.btnDisable
              }
              type="submit"
              className="login-button"
              onClick={() => this.manageReg()}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Registrera"
              )}
            </button>
            <div class="separator">eller</div>
            <Federated federated={federated} />
          </div>
          <div className="login-link">
            Har redan ett konto? <Link to="login">Logga in här</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
