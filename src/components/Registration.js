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
    label: "Email",
  },
  {
    id: "password",
    type: "password",
    label: "Lösenord",
    passwordVisibilityToggle: true,
  },
];
class Registration extends Component {
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
      passwordShow: false,
    };
  }
  shouldMarkError = (field, fields) => {
    const hasError = validate(fields)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  onChange = (id, value, hasError) => {
    this.setState({ [id]: value, uniError: false, [`${id}Error`]: false });
    if (id === "email" && !value.match(/.+@.+/)) {
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
  onBlur = (field) => (evt) => {
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
  handleRegistration = async (federation) => {
    this.setState({
      loading: true,
    });
    switch (federation) {
      case "cognito":
        if (!this.canBeSubmitted()) {
          return;
        }
        await Auth.signUp({
          username: this.state.email,
          password: this.state.password,
        }).catch((err) => {
          this.setState({
            loading: false,
          });
          console.log(err);
          if (err.code === "UsernameExistsException") {
            this.setState({
              emailError: true,
              emailErrorMessage: "Ett konto med denna address existerar redan",
            });
          } else if (err.message === "Invalid email address format.") {
            this.setState({
              emailError: true,
              emailErrorMessage: "Skriv in ett giltigt email",
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
        buttons={true}
        buttonValue="Registrera"
        buttonFullWidth={true}
        buttonPrimary={true}
        buttonDisabled={isDisabled}
        loading={this.state.loading}
        federatedButtons={true}
        federatedButtonsPos="top"
        header={true}
        headerValue="Registrering"
        position="center"
        type="registration"
        link="login"
        linkValue="Logga in här"
        linkText="Har redan ett konto?"
        submit={(federation) => this.handleRegistration(federation)}
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
                this.handleRegistration("cognito");
              }
            }}
            onChange={(value) => this.onChange(field.id, value)}
            onBlur={() => this.onBlur(field.id)}
            passwordVisibilityToggle={field.passwordVisibilityToggle}
          />
        ))}
      </Form>
    );
  }
}

export default withRouter(Registration);
