import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import ReactCSSTransitionReplace from "react-css-transition-replace";

class PasswordReset extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      everFocusedUsername: false,
      inFocus: "",
      touched: {
        username: false,
      },
      usernameErrorMessage: "Detta fält kan inte vara tomt",
      usernameError: false,
      gotUsername: false,
      loading: false,
    };
  }

  validate = (username) => {
    return {
      username: username.length === 0,
    };
  };
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
    const hasError = this.validate(this.state.username)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true,
      },
      usernameError: false,
      usernameErrorMessage: "Detta fält kan inte vara tomt",
      codeError: false,
      codeErrorMessage: "Detta fält kan inte vara tomt",
    });
  };

  canBeSubmitted = () => {
    const errors = this.validate(this.state.username);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };

  checkForEnter = (e) => {
    if (e.key === "Enter") {
      this.managePassword();
    }
  };
  managePassword = () => {
    this.setState({
      loading: true,
    });
    var username = this.state.username;
    Auth.forgotPassword(username)
      .then((data) => {
        this.setState({
          gotUsername: true,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        if (err.code == "LimitExceededException") {
          console.log(err.message);
          this.setState({
            usernameError: true,
            usernameErrorMessage:
              "Gränsen för försök har uppnåtts, var god och försök igen senare",
          });
        } else {
          this.setState({
            usernameError: true,
            usernameErrorMessage: "Användaren existerar inte",
          });
        }
      });
  };
  finishReset = (password) => {
    this.setState({
      finished: true,
      password: password,
    });
  };
  render() {
    const errors = this.validate(this.state.username);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h2>Ändra lösenordet</h2>
          </div>
          {this.state.gotUsername === false && (
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
                  autocomplete="off"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  onBlur={this.handleBlur("username")}
                  onKeyDown={this.checkForEnter}
                  autoFocus
                ></input>
                {this.shouldMarkError("username") ||
                this.state.usernameError ? (
                  <p className="input-error-message">
                    {this.state.usernameErrorMessage}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <button
                disabled={isDisabled || this.state.loading}
                type="submit"
                className="login-button"
                onClick={() => this.managePassword()}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Skicka kod"
                )}
              </button>
            </div>
          )}
          {this.state.gotUsername === true && (
            <PasswordConfirmation
              username={this.state.username}
              history={this.props.history}
            ></PasswordConfirmation>
          )}
          <div className="login-link">
            <Link to="registration">Skapa ett nytt konto här</Link>
          </div>
        </div>
      </div>
    );
  }
}

class PasswordConfirmation extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      password: "",
      confirmPassword: "",
      everFocusedCode: false,
      everFocusedPassword: false,
      everFocusedConfirm: false,
      inFocus: "",
      touched: {
        code: false,
        password: false,
        confirmPassword: false,
      },
      codeErrorMessage: "Detta fält kan inte vara tomt",
      codeError: false,
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      passwordError: false,
      confirmErrorMessage: "Detta fält kan inte vara tomt",
      confirmError: false,
      hidden: true,
      finished: false,
      loadingResend: false,
      loadingResendDone: false,
      loading: false,
    };
  }
  validate = (code, password) => {
    return {
      code: code.length === 0,
      password: password.length === 0,
    };
  };
  shouldMarkError = (field) => {
    const hasError = this.validate(this.state.code, this.state.password)[field];
    console.log(hasError);
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleCodeChange = (evt) => {
    this.setState({ code: evt.target.value });
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
  handleBlur = (field) => (evt) => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true,
      },
      codeError: false,
      codeErrorMessage: "Detta fält kan inte vara tomt",
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      passwordError: false,
    });
  };

  canBeSubmitted = () => {
    const errors = this.validate(this.state.code, this.state.password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };

  checkForEnter = (e) => {
    if (e.key === "Enter") {
      this.confirmCode();
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

  confirmCode = () => {
    this.setState({
      loading: true,
    });
    var username = this.props.username;
    var code = this.state.code;
    var new_password = this.state.password;
    Auth.forgotPasswordSubmit(username, code, new_password)
      .then((data) => {
        this.setState({
          loading: false,
          finished: true,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        console.log(err);
        if (err.code === "CodeMismatchException") {
          this.setState({
            codeError: true,
            codeErrorMessage: "Var vänlig och skriv in en korrekt kod",
          });
        } else if (err.code === "InvalidParameterException") {
          this.setState({
            passwordError: true,
            passwordErrorMessage: "Lösenordet måste vara minst 8 tecken lång",
          });
        }
      });
  };
  resend = () => {
    var username = this.props.username;
    this.setState({
      loading: true,
      loadingResend: true,
      loadingResendDone: false,
    });
    Auth.forgotPassword(username).then((res) => {
      setTimeout(() => {
        this.setState({
          loading: false,
          loadingResend: false,
          loadingResendDone: true,
        });
      }, 500);
    }).catch(err =>{
      console.log(err)
    });
  };
  login = () => {
    this.setState({
      loading: true,
    });
    const username = this.props.username;
    const password = this.state.password;
    Auth.signIn({
      username, // Required, the username
      password, // Optional, the password
    })
      .then((user) => {
        this.props.history.push("/home");
      })
      .catch((err) => console.log(err));
  };
  render() {
    const errors = this.validate(this.state.code, this.state.password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    console.log(this.state.finished);
    return (
      <div className="form-container">
        {this.state.finished === false ? (
          <div>
            <p style={{ fontSize: "15px" }}>
              Koden bör komma till er email inom kort. Håll koll på er spam
              folder ifall mejlet inte dyker upp eller
              <Link onClick={() => this.resend()} className="text-link">
                tryck här för att skicka koden igen
              </Link>{" "}
              {this.state.loadingResend === true && (
                <i
                  style={{ color: "#b1aca3" }}
                  className="fas fa-sync fa-spin"
                ></i>
              )}
              {this.state.loadingResendDone === true && (
                <i style={{ color: "#7b8c49" }} className="fas fa-check"></i>
              )}
            </p>
            <div className="input-wrappers">
              <lable for="code">Kod</lable>
              <input
                type="number"
                className={
                  this.shouldMarkError("code") || this.state.codeError === true
                    ? "input-error custom-input"
                    : "custom-input"
                }
                id="code"
                autocomplete="off"
                value={this.state.code}
                onChange={this.handleCodeChange}
                onBlur={this.handleBlur("code")}
                onKeyDown={this.checkForEnter}
                autoFocus
              ></input>
              {this.shouldMarkError("code") || this.state.codeError ? (
                <p className="input-error-message">
                  {this.state.codeErrorMessage}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="input-wrappers">
              <lable for="password">Nytt Lösenord</lable>
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
              disabled={isDisabled || this.state.loading}
              type="submit"
              className="login-button"
              onClick={() => this.confirmCode()}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Ändra lösenordet"
              )}
            </button>
          </div>
        ) : (
          <div>
            <p>
              <b>Klart!</b> Lösenordet är nu bytt och du kan logga in med ditt
              nya lösenord automatiskt genom att trycka på knappen nedan eller
              använda inloggnings sidan
            </p>
            <button
              disabled={this.state.loading}
              type="submit"
              className="login-button"
              onClick={() => this.login()}
            >
              {this.state.loading === true ? (
                <i className="fas fa-sync fa-spin"></i>
              ) : (
                "Logga in"
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default PasswordReset;
