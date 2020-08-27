import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import Form from "./views/Form";
import validate from "../redundant_functions/validate";
import FormSubmission from "./views/FormSubmission";
import HelperTextProp from "./views/HelperTextProp";
import Input from "./views/view_components/Input";
const firstFields = [
  {
    id: "email",
    type: "email",
    label: "Email/Telefon",
  },
];
const secondFields = [
  {
    id: "code",
    type: "number",
    label: "Kod",
  },
  {
    id: "password",
    type: "password",
    label: "Lösenord",
    passwordVisibilityToggle: true,
  },
];
class PasswordForgot extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      code: "",
      everFocusedEmail: false,
      everFocusedPassword: false,
      gotEmail: false,
      everFocusedCode: false,
      inFocus: "",
      touched: {
        email: false,
        password: false,
        code: false,
      },
      emailErrorMessage: "Detta fält kan inte vara tomt",
      passwordErrorMessage: "Detta fält kan inte vara tomt",
      emailError: false,
      passwordError: false,
      codeErrorMessage: "Detta fält kan inte vara tomt",
      codeError: false,
      loading: false,
      uniError: false,
      uniErrorMessage:
        "För många försök har gjorts. Var vänlig och försök lite senare",
      passwordShow: false,
      loadingResend: false,
      loadingResendDone: false,
      changeDone: false,
    };
  }
  shouldMarkError = (field, fields) => {
    const hasError = validate(fields)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  onChange = (id, value) => {
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
  handleCode = async (withCode) => {
    this.setState({
      loading: true,
    });
    if (!withCode) {
      Auth.forgotPassword(this.state.email)
        .then((data) => {
          this.setState({
            gotEmail: true,
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          if (err.code === "LimitExceededException") {
            console.log(err.message);
            this.setState({ uniError: true });
          } else {
            this.setState({
              emailError: true,
              emailErrorMessage: "Användaren existerar inte",
            });
          }
        });
    } else {
      Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.code,
        this.state.password
      )
        .then((data) => {
          this.setState({
            loading: false,
            changeDone: true,
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
    }
  };
  resend = () => {
    this.setState({
      loading: true,
      loadingResend: true,
      loadingResendDone: false,
    });
    Auth.forgotPassword(this.state.email)
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
        this.setState({ loading: false });
        if (err.code === "LimitExceededException") {
          this.setState({ uniError: true });
        }
      });
  };
  login = async () => {
    this.setState({ loading: true });
    Auth.signIn({
      username: this.state.email, // Required, the username
      password: this.state.password, // Optional, the password
    }).catch((err) => this.setState({ loading: false }));
  };
  render() {
    const currentFields = !this.state.gotEmail ? firstFields : secondFields;
    const errors = validate(
      currentFields.map((field) => {
        return { ...field, value: this.state[field.id] };
      })
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div>
        {!this.state.changeDone ? (
          <Form
            border={true}
            uniError={this.state.uniError}
            uniErrorMessage={this.state.uniErrorMessage}
            buttons={true}
            buttonValue={!this.state.gotEmail ? "Skicka kod" : "Ändra Lösenord"}
            buttonFullWidth={true}
            buttonPrimary={true}
            buttonDisabled={isDisabled}
            loading={this.state.loading}
            header={true}
            headerValue="Ändra lösenord"
            position="center"
            type="login"
            link="registration"
            linkValue="Skapa ett här"
            linkText="Har inget konto?"
            helperTextProp={
              !this.state.gotEmail ? null : (
                <HelperTextProp
                  resend={() => this.resend()}
                  loadingResend={this.state.loadingResend}
                  loadingResendDone={this.state.loadingResendDone}
                />
              )
            }
            submit={() => this.handleCode(this.state.gotEmail)}
          >
            {currentFields.map((field, i) => (
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
                  this.state.uniError
                    ? ""
                    : this.state[`${field.id}ErrorMessage`]
                }
                required
                value={this.state[field.id]}
                checkForEnter={(code) => {
                  if (code === 13) {
                    this.handleCode(this.state.gotEmail);
                  }
                }}
                onChange={(value) => this.onChange(field.id, value)}
                onBlur={() => this.onBlur(field.id)}
                passwordVisibilityToggle={field.passwordVisibilityToggle}
              />
            ))}
          </Form>
        ) : (
          <FormSubmission
            text="Lösenordet är nu bytt och du kan logga in med ditt
            nya lösenord automatiskt genom att trycka på knappen nedan eller
            använda "
            loading={this.state.loading}
            link
            linkTo="/login"
            linkText="inloggnings sidan"
            button
            buttonText="Logga in"
            handleClick={this.login}
          />
        )}
      </div>
    );
  }
}

export default withRouter(PasswordForgot);
