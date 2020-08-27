import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import Form from "./views/Form";
import validate from "../redundant_functions/validate";
import Input from "./views/view_components/Input";

const fields = [
  {
    id: "email",
    type: "email",
    label: "Email/Telefon",
  },
  {
    id: "password",
    type: "password",
    label: "Lösenord",
  },
];

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      everFocusedEmail: false,
      everFocusedPassword: false,
      inFocus: "",
      touched: {
        email: false,
        password: false,
      },
      emailErrorMessage: "Detta fält kan inte vara tomt",
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      emailError: false,
      passwordError: false,
      loading: false,
      uniError: false,
      uniErrorMessage: "Emailet och lösenordet matchar inte",
    };
  }
  shouldMarkError = (field, fields) => {
    const hasError = validate(fields)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  onChange = (id, value) => {
    if (this.state.uniError) {
      this.setState({
        [id]: value,
        uniError: false,
        emailError: false,
        passwordError: false,
      });
    } else {
      this.setState({ [id]: value, uniError: false, [`${id}Error`]: false });
    }
  };
  onBlur = (field) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };
  canBeSubmitted = () => {
    const errors = validate(
      fields.map((field) => {
        return { ...field, value: this.state[field.id] };
      })
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };
  handleLogin = async (federation) => {
    this.setState({
      loading: true,
    });
    switch (federation) {
      case "cognito":
        if (!this.canBeSubmitted()) {
          return;
        }
        await Auth.signIn({
          username: this.state.email, // Required, the username
          password: this.state.password, // Optional, the password
        }).catch((err) => {
          if (
            err ===
              "AuthError: The username should either be a string or one of the sign in types" ||
            err.message === "null invocation failed due to configuration."
          ) {
            this.setState({
              emailError: true,
              emailErrorMessage: "Detta fält kan inte vara tomt",
              passwordError: true,
              passwordErrorMessage: "Detta fält kan inte vara tomt",
              loading: false,
            });
          } else if (
            err.code === "NotAuthorizedException" ||
            err.code === "UserNotFoundException"
          ) {
            this.setState({
              emailError: true,
              passwordError: true,
              uniError: true,
              loading: false,
            });
          }
        });
        break;
      case "google":
        await Auth.federatedSignIn({
          provider: "Google",
        }).then((res) => console.log(res));
        break;
      case "fb":
        await Auth.federatedSignIn({
          provider: "Facebook",
        }).then((res) => console.log(res));
        break;
      default:
        console.log(federation);
    }
  };
  render() {
    const errors = validate(
      fields.map((field) => {
        return { ...field, value: this.state[field.id] };
      })
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <Form
        border={true}
        uniError={this.state.uniError}
        uniErrorMessage={this.state.uniErrorMessage}
        buttons={true}
        buttonValue="Logga in"
        buttonFullWidth={true}
        buttonPrimary={true}
        buttonDisabled={isDisabled}
        loading={this.state.loading}
        federatedButtons={true}
        forgotPassword={true}
        header={true}
        headerValue="Logga in"
        position="center"
        type="login"
        link="registration"
        linkValue="Skapa ett här"
        linkText="Har inget konto?"
        submit={(federatedType) => this.handleLogin(federatedType)}
      >
        {fields.map((field, i) => (
          <Input
            key={i}
            id={field.id}
            type={field.type}
            label={field.label}
            error={
              this.state[`${field.id}Error`] ||
              this.shouldMarkError(field.id, [
                { id: field.id, value: this.state[field.id] },
              ])
            }
            errorText={
              this.state.uniError ? "" : this.state[`${field.id}ErrorMessage`]
            }
            required
            value={this.state[field.id]}
            checkForEnter={(code) => {
              if (code === 13) {
                this.handleLogin("cognito");
              }
            }}
            onChange={(value) => this.onChange(field.id, value)}
            onBlur={() => this.onBlur(field.id)}
          />
        ))}
      </Form>
    );
  }
}
export default withRouter(Login);
