import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import {
  Slider,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  AppBar,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { VisibilityOff, Visibility } from "@material-ui/icons";
import theme from "../theme";
const CustomTextField = withStyles({
  root: {
    "& input": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& .MuiInputBase-multiline": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& input:valid:focus": {
      backgroundColor: "transparent !important",
    },
    "& .Mui-focused": {
      backgroundColor: "transparent !important",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      background: "rgb(245, 244, 242)",
    },
  },
})(TextField);
const useStyles = (theme) => ({
  input: {
    width: "100%",
  },
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submit: {
    background: "#ea3a3a",
    padding: "10px 20px",
    boxSizing: "border-box",
    fontSize: 15,
    border: 0,
    marginTop: 20,
    transition: "0.4s",
    width: "100%",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#ff5050",
      transition: "0.4s",
    },
    "&:focus": {
      outline: "none",
    },
    "&:disabled": {
      backgroundColor: "rgb(245, 244, 242)",
      color: "rgb(177, 172, 163)",
    },
  },
  socialBtn: {
    textAlign: "center",
    textDecoration: "none",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    border: "none",
    borderRadius: 10,
    textDecoration: "none",
    background: "#fbf9f9",
    cursor: "pointer",
    marginTop: 30,
    border: "2px solid #bf9c96",
  },
  socialWrapper: {
    display: "flex",
    alignItems: "center",
  },
});

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
      btnDisable: true,
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
    if (!evt.target.value.match(/.+@.+/)) {
      this.setState({
        usernameError: true,
        usernameErrorMessage: "Skriv in ett giltigt email",
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
    console.log(username);
    Auth.forgotPassword(this.state.username)
      .then((data) => {
        console.log(data);
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
    const { classes } = this.props;
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h2>Ändra lösenordet</h2>
          </div>
          {this.state.gotUsername === false && (
            <div className="form-container">
              <ThemeProvider theme={theme}>
                <div className="input-wrappers">
                  <CustomTextField
                    className={classes.input}
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    onKeyDown={this.checkForEnter}
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                    onBlur={this.handleBlur("username")}
                    onKeyDown={this.checkForEnter}
                    error={
                      this.state.usernameError ||
                      this.shouldMarkError("username")
                    }
                    helperText={
                      this.state.usernameError ||
                      this.shouldMarkError("username")
                        ? this.state.usernameErrorMessage
                        : ""
                    }
                    InputProps={{
                      style: { fontSize: 15 },
                    }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      required: true,
                    }}
                  ></CustomTextField>
                </div>
              </ThemeProvider>
              <Button
                disabled={
                  isDisabled || this.state.loading || this.state.btnDisable
                }
                type="submit"
                className={classes.submit}
                onClick={() => this.managePassword()}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Skicka kod"
                )}
              </Button>
            </div>
          )}
          {this.state.gotUsername === true && (
            <PasswordConfirmation
              username={this.state.username}
              history={this.props.history}
              classes={classes}
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
      passwordShow: false,
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
    Auth.forgotPassword(username)
      .then((res) => {
        setTimeout(() => {
          this.setState({
            loading: false,
            loadingResend: false,
            loadingResendDone: true,
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
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
  renderPasswordVisibility = (classes) => {
    return (
      <InputAdornment style={{ background: "transparent" }} position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() =>
            this.setState({
              passwordShow: !this.state.passwordShow,
            })
          }
        >
          {this.state.passwordShow ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  };
  render() {
    const errors = this.validate(this.state.code, this.state.password);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className="form-container">
        {this.state.finished === false ? (
          <div>
            <p style={{ fontSize: "15px" }}>
              Koden bör komma till er email inom kort ifall användaren existerar
              i databasen och email addressen är verifierad. Håll koll på er
              spam folder ifall mejlet inte dyker upp eller
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
            <ThemeProvider theme={theme}>
              <div className="input-wrappers">
                <CustomTextField
                  className={this.props.classes.input}
                  label="Kod"
                  type="number"
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.code}
                  onChange={this.handleCodeChange}
                  onBlur={this.handleBlur("code")}
                  onKeyDown={this.checkForEnter}
                  error={this.state.codeError || this.shouldMarkError("code")}
                  helperText={
                    this.state.codeError || this.shouldMarkError("code")
                      ? this.state.codeErrorMessage
                      : ""
                  }
                  InputProps={{
                    style: { fontSize: 15 },
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    required: true,
                  }}
                ></CustomTextField>
              </div>
              <div className="input-wrappers">
                <CustomTextField
                  className={this.props.classes.input}
                  label="Nytt Lösenord"
                  type={this.state.passwordShow ? "text" : "password"}
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  onBlur={this.handleBlur("password")}
                  onKeyDown={this.checkForEnter}
                  error={
                    this.state.passwordError || this.shouldMarkError("password")
                  }
                  helperText={
                    this.state.passwordError || this.shouldMarkError("password")
                      ? this.state.passwordErrorMessage
                      : ""
                  }
                  InputProps={{
                    style: { fontSize: 15 },
                    endAdornment: this.renderPasswordVisibility(
                      this.props.classes
                    ),
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    required: true,
                  }}
                ></CustomTextField>
                <Link to="password-reset">Glömt lösenordet?</Link>
              </div>
            </ThemeProvider>
            <Button
              disabled={isDisabled || this.state.loading}
              type="submit"
              className={this.props.classes.submit}
              onClick={() => this.confirmCode()}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Ändra lösenordet"
              )}
            </Button>
          </div>
        ) : (
          <div>
            <p>
              <b>Klart!</b> Lösenordet är nu bytt och du kan logga in med ditt
              nya lösenord automatiskt genom att trycka på knappen nedan eller
              använda inloggnings sidan
            </p>
            <Button
              disabled={this.state.loading}
              type="submit"
              className={this.props.classes.submit}
              onClick={() => this.login()}
            >
              {this.state.loading === true ? (
                <i className="fas fa-sync fa-spin"></i>
              ) : (
                "Logga in"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(PasswordReset);
