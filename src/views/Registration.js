import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import $ from "jquery";
import intlTelInput from "intl-tel-input/build/js/intlTelInput";
import utils from "intl-tel-input/build/js/utils";
import { withFederated } from "aws-amplify-react";
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
import { Visibility, VisibilityOff } from "@material-ui/icons";
import theme from "../theme";
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
    <Button className={props.classes.socialBtn}>
      <div className={props.classes.socialWrapper}>
        <img
          style={{ marginRight: "0.25em" }}
          src="//d35aaqx5ub95lt.cloudfront.net/images/google-color.svg"
        ></img>
        <span className="google-btn">Google</span>
      </div>
    </Button>
    <Button className={props.classes.socialBtn}>
      <div className={props.classes.socialWrapper}>
        <img
          style={{ marginRight: "0.25em" }}
          src="//d35aaqx5ub95lt.cloudfront.net/images/facebook-blue.svg"
        ></img>
        <span className="fb-btn">Facebook</span>
      </div>
    </Button>
  </div>
);

const Federated = withFederated(Buttons);

const federated = {
  google_client_id:
    "216481722641-n8cdp068qrd3ebpi70l2recq8rkj3430.apps.googleusercontent.com", // Enter your google_client_id here
  facebook_app_id: "2711841088850140", // Enter your facebook_app_id here
};
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
      passwordShow: false,
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
        this.props.history.push("login");
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
    const errors = validate(
      this.state.username,
      this.state.password,
      this.state.name,
      this.state.email
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    const { classes } = this.props;
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h2>Registrera</h2>
          </div>
          <div className="form-container">
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
                  label="Namn"
                  type="text"
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.name}
                  onChange={this.handleNameChange}
                  onBlur={this.handleBlur("name")}
                  onKeyDown={this.checkForEnter}
                  error={this.state.nameError || this.shouldMarkError("name")}
                  helperText={
                    this.state.nameError || this.shouldMarkError("name")
                      ? this.state.nameErrorMessage
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
                  label="Email"
                  type="text"
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  onBlur={this.handleBlur("email")}
                  onKeyDown={this.checkForEnter}
                  error={this.state.emailError || this.shouldMarkError("email")}
                  helperText={
                    this.state.emailError || this.shouldMarkError("email")
                      ? this.state.emailErrorMessage
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
                    endAdornment: this.renderPasswordVisibility(classes),
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
              onClick={() => this.manageReg()}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Registrera"
              )}
            </Button>
            <div class="separator">eller</div>
            <Federated federated={federated} classes={classes} />
          </div>
          <div className="login-link">
            Har redan ett konto? <Link to="login">Logga in här</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Registration);
