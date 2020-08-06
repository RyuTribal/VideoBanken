import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";
import HermesLogo from "../img/hermes-logo.svg";
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
} from "@material-ui/core";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import theme from "../theme";

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
  manageLogin = async (evt) => {
    this.setState({
      loading: true,
    });
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }
    const username = this.state.username;
    const password = this.state.password;
    await Auth.signIn({
      username: username, // Required, the username
      password: password, // Optional, the password
    })
      .then((user) => {
        console.log(user);
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
    const { classes } = this.props;
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
            <ThemeProvider theme={theme}>
              <div className="input-wrappers">
                <CustomTextField
                  className={classes.input}
                  label="Användarnamn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  onBlur={this.handleBlur("username")}
                  onKeyDown={this.checkForEnter}
                  error={
                    this.state.usernameError || this.shouldMarkError("username")
                  }
                  helperText={
                    this.state.usernameError || this.shouldMarkError("username")
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
              <div className="input-wrappers">
                <CustomTextField
                  className={classes.input}
                  label="Lösenord"
                  type="password"
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
              className={classes.submit}
              onClick={() => this.manageLogin()}
            >
              {this.state.loading === true ? (
                <i className="fas fa-sync fa-spin"></i>
              ) : (
                "Logga in"
              )}
            </Button>
            <div className="separator">eller</div>
            <div>
              <Button className={classes.socialBtn}>
                <div className={classes.socialWrapper}>
                  <img
                    style={{ marginRight: "0.25em" }}
                    src="//d35aaqx5ub95lt.cloudfront.net/images/google-color.svg"
                  ></img>
                  <span className="google-btn">Google</span>
                </div>
              </Button>
              <Button className={classes.socialBtn}>
                <div className={classes.socialWrapper}>
                  <img
                    style={{ marginRight: "0.25em" }}
                    src="//d35aaqx5ub95lt.cloudfront.net/images/facebook-blue.svg"
                  ></img>
                  <span className="fb-btn">Facebook</span>
                </div>
              </Button>
            </div>
          </div>
          <div className="login-link">
            Har inget konto? <Link to="registration">Skapa ett här</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Login);
