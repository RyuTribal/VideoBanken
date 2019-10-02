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
var that;
class Registration extends Component {
  componentWillMount() {
    that = this;
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(function(user) {
        that.props.history.push("/home")
      })
      .catch(function(err){
        $("input").keyup(function(event) {
          if (event.keyCode === 13) {
            $(".login-btn-confirm").click();
          }
        });
        var upperCase = new RegExp("[A-Z]");
        var lowerCase = new RegExp("[a-z]");
        var numbers = new RegExp("[0-9]");
        $("#password").keyup(function() {
          if ($(this).val().length >= 7) {
            console.log("works");
            $(".password-length").addClass("validPassword");
          } else {
            $(".password-length").removeClass("validPassword");
          }
          if (
            $(this)
              .val()
              .match(upperCase) &&
            $(this)
              .val()
              .match(lowerCase)
          ) {
            $(".password-upper").addClass("validPassword");
          } else {
            $(".password-upper").removeClass("validPassword");
          }
          if (
            $(this)
              .val()
              .match(numbers)
          ) {
            $(".password-number").addClass("validPassword");
          } else {
            $(".password-number").removeClass("validPassword");
          }
          if ($("#password").val() == $("#password-repeat").val()) {
            $(".password-match").addClass("validPassword");
          } else {
            $(".password-match").removeClass("validPassword");
          }
        });
        $("#password-repeat").keyup(function() {
          if ($("#password").val() == $("#password-repeat").val()) {
            $(".password-match").addClass("validPassword");
          } else {
            $(".password-match").removeClass("validPassword");
          }
        });
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
          var input = $(
            $(this)
              .find("i")
              .attr("toggle")
          );
          if (input.attr("type") == "password") {
            input.attr("type", "text");
          } else {
            input.attr("type", "password");
          }
        });
      });
    
  }

  manageReg() {
    $(".error").css("opacity", "0");
    $(".error")
      .find("p")
      .text();
    var username = $("#username").val();
    var given_name = $("#first-name").val();
    var family_name = $("#last-name").val();
    var email = $("#email").val();
    var address = $("#adress").val();
    var birthdate = $("#date").val();
    var phone_number = $(".iti__selected-dial-code").text() + $("#phone").val();
    var password = $("#password").val();
    var confirmed = $("#password-repeat").val();
    console.log(given_name);
    if ($("#password").val() != $("#password-repeat").val()) {
      $("#password-repeat")
        .closest(".col-md-6")
        .find(".error")
        .find("p")
        .text("Passwords do not match");
      $("#password-repeat")
        .closest(".col-md-6")
        .find(".error")
        .css("opacity", "1");
    } else {
      Auth.signUp({
        username: username,
        password: password,
        attributes: {
          given_name: given_name,
          birthdate: birthdate,
          address: address,
          family_name: family_name,
          email: email,
          phone_number: phone_number
        }
      })
        .then(function(user) {
          Auth.signIn({
            username, // Required, the username
            password // Optional, the password
          }).then(function() {
            that.props.history.push("/home");
          }).catch(err => console.log(err));
        })
        .catch(function(err) {
          console.log(err);
          if (
            err.message == "Error creating account" ||
            err.message == "Username cannot be empty" ||
            err.message == "PreSignUp failed with error x is not defined."
          ) {
            $("input").each(function() {
              if ($(this).val() == "") {
                $(this)
                  .closest(".col-md-6")
                  .find(".error")
                  .find("p")
                  .text("This field cannot be empty");
                $(this)
                  .closest(".col-md-6")
                  .find(".error")
                  .css("opacity", "1");
              }
            });
          } else if (err.message == "User already exists") {
            $("#username")
              .closest(".col-md-6")
              .find(".error")
              .find("p")
              .text("Username already taken");
            $("#username")
              .closest(".col-md-6")
              .find(".error")
              .css("opacity", "1");
          } else if (
            err.message == "PreSignUp failed with error u is not defined."
          ) {
            $("#username")
              .closest(".col-md-6")
              .find(".error")
              .find("p")
              .text(
                "Username cannot contain special characters besides - or _"
              );
            $("#username")
              .closest(".col-md-6")
              .find(".error")
              .css("opacity", "1");
          } else if (err.message == "Invalid email address format.") {
            $("#email")
              .closest(".col-md-6")
              .find(".error")
              .find("p")
              .text("Please enter a valid email");
            $("#email")
              .closest(".col-md-6")
              .find(".error")
              .css("opacity", "1");
          } else if (
            err.message == "PreSignUp failed with error p is not defined."
          ) {
            $("#password_repeat")
              .closest(".col-md-6")
              .find(".error")
              .find("p")
              .text("Passwords do not match");
            $("#password_repeat")
              .closest(".col-md-6")
              .find(".error")
              .css("opacity", "1");
          }
        });
    }
  }
  render() {
    return (
      <div className="login-container">
        <div className="form-container reg">
          <h2 className="form-title">Sign up</h2>
          <div className="form">
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="username">
                  Username*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="first-name">
                  Given name*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="last-name">
                  Family name*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="email">
                  Email*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="adress">
                  Adress*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="date">
                  Date of birth*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  name="date"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>

            <div id="tel-container" class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="telephone">
                  Telephone*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  name="telephone"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="password">
                  Password*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="password-repeat">
                  Confirm*:
                </label>
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
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div class="col-md-6">
              <ul className="password-req">
                <li className="password-desc">Password requirements:</li>
                <li className="password-length">
                  Must be atleast 8 characters long
                </li>
                <li className="password-upper">
                  Must contain an uppercase and lowercase character
                </li>
                <li className="password-number">Must contain a number</li>
                <li className="password-match">Password must match</li>
              </ul>
            </div>
            <button className="login-btn-confirm" onClick={this.manageReg}>
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
