import React, { Component } from "react";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import $ from "jquery";
import intlTelInput from "intl-tel-input/build/js/intlTelInput";
import utils from "intl-tel-input/build/js/utils";

Amplify.configure(awsconfig);

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: "eu-west-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-1_2Kqz9413g",
    userPoolWebClientId: "7lgiaa2fnd810mh5orp5evuf93"
  }
});

const currentConfig = Auth.configure();

class Registration extends Component {
  componentDidMount() {
    var input = document.querySelector("#phone");
    intlTelInput(input, {
      dropdownContainer: document.body,
      initialCountry: "se",
      nationalMode: false,
      formatOnDisplay: false,
      separateDialCode: true,
      preferredCountries: ["se", "gb"],
      utilsScript: utils
    });
    $(".icon-wrapper").click(function() {
      $(this)
        .find("i")
        .toggleClass("fa-eye");
      $(this)
        .find("i")
        .toggleClass("fa-eye-slash");
      var input = $($(this).find("i").attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
  }
  render() {
    return (
      <div className="login-container">
        <div className="form-container reg">
          <div className="form">
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="username">
                  Username*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  name="username"
                  placeholder="eg. TheTerminator2008"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="first-name">
                  Given name*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="first-name"
                  className="form-input"
                  name="first-name"
                  placeholder="eg. John"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="last-name">
                  Family name*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="last-name"
                  className="form-input"
                  name="last-name"
                  placeholder="eg. Connor"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="email">
                  Email*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  name="email"
                  placeholder="eg. john.connor@gmail.com"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="adress">
                  Adress*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="adress"
                  className="form-input"
                  name="adress"
                  placeholder="eg. Musikalvägen 1"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="date">
                  Date of birth*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  name="date"
                />
              </div>
            </div>

            <div id="tel-container" class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="telephone">
                  Telephone*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  name="telephone"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="password">
                  Password*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
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
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="password-repeat">
                  Repeat password*:
                </label>
                <div className="error error-msg-pass">
                  <p></p>
                </div>
              </div>
              <div class="field-wrapper">
                <input
                  id="password-repeat"
                  type="password"
                  className="form-input password-wrap"
                  name="password-repeat"
                />
                <div className="icon-wrapper">
                  <i
                    toggle="#password-repeat"
                    className="fas fa-eye toggle-password"
                  ></i>
                </div>
              </div>
            </div>
            <button className="login-btn-confirm" onClick={this.manageLogin}>
              Register
            </button>
            <hr className="hr-text" data-content="or sign in with" />
            <div className="reg-links">
              Have an account already? <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
