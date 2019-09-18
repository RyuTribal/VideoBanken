import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";
import slick from "../commercial/slick/slick";
import { blockStatement } from "@babel/types";

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

class PasswordReset extends Component {
  componentDidMount() {
    var upperCase = new RegExp("[A-Z]");
    var lowerCase = new RegExp("[a-z]");
    var numbers = new RegExp("[0-9]");
    $("#new_password").keyup(function() {
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
    $("#confirm").keyup(function() {
      if ($("#new_password").val() == $("#confirm").val()) {
        $(".password-match").addClass("validPassword");
      } else {
        $(".password-match").removeClass("validPassword");
      }
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
  }
  managePassword() {
    $(".error").css("opacity", "0");
    $(".error")
      .find("p")
      .text();
    var username = $("#username").val();
    Auth.forgotPassword(username)
      .then(function(data) {
        $("#code-comf").css("display", "block");
        $("#username-comf").css("display", "none");
        $("#new-password").css("display", "block");
        $("#confirm-password").css("display", "block");
        $("#new-pass-req").css("display", "block");
        $(".send-code-btn").css("display", "none");
        $(".confirm-password-btn").css("display", "block");
      })
      .catch(function(err) {
        console.log(err);
        if (err.code == "LimitExceededException") {
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .find("p")
            .text(err.message);
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .css("opacity", "1");
        }
        else{
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .find("p")
            .text("User doesn't exist");
          $("#username")
            .closest(".col-md-12")
            .find(".error")
            .css("opacity", "1");
        }
      });
  }

  confirmCode() {
    $(".error").css("opacity", "0");
    $(".error")
      .find("p")
      .text();
    var username = $("#username").val();
    var code = $("#code").val();
    var new_password = $("#new_password").val();
    var confirm = $("#confirm").val();
    if (new_password != confirm) {
      $("#confirm")
        .closest(".col-md-6")
        .find(".error")
        .find("p")
        .text("Passwords do not match");
      $("#confirm")
        .closest(".col-md-6")
        .find(".error")
        .css("opacity", "1");
    } else {
      Auth.forgotPasswordSubmit(username, code, new_password)
        .then(function(data) {
          $(".col-md-12").css("display", "none");
          $(".col-md-6").css("display", "none");
          $("button").css("display", "none");
          $("hr").css("display", "none");
          $(".reg-links").css("display", "none");
          $("#redirect-new-pass").css("display", "block");
        })
        .catch(function(err) {
          console.log(err);
          if (
            err.message == "Confirmation code cannot be empty" ||
            err.message == "Password cannot be empty"
          ) {
            $("input").each(function() {
              if ($(this).val() == "") {
                $(this)
                  .parent()
                  .parent()
                  .find(".error")
                  .find("p")
                  .text("This field cannot be empty");
                $(this)
                  .parent()
                  .parent()
                  .find(".error")
                  .css("opacity", "1");
              }
            });
          } else if(err.code == "CodeMismatchException"){
            $("#code")
              .closest(".col-md-12")
              .find(".error")
              .find("p")
              .text("Please enter a valid code");
            $("#code")
              .closest(".col-md-12")
              .find(".error")
              .css("opacity", "1");
          }
        });
    }
  }

  resend() {
    var username = $("#username").val();
    Auth.forgotPassword(username);
  }
  render() {
    return (
      <div className="login-container">
        <div className="form-container">
          <h2 className="form-title">Reset password</h2>
          <div className="form">
            <div id="username-comf" className="col-md-12">
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
            <div id="code-comf" className="col-md-12">
              <p>
                You will recieve a code to your email. Enter the code sent here
              </p>
              <p>
                If you didn't recieve the code,{" "}
                <Link onClick={this.resend}>click here to resend.</Link>
              </p>
              <div className="label-error-wrapper">
                <label className="input-label" for="code">
                  Code*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="text"
                  id="code"
                  className="form-input"
                  name="code"
                  placeholder="eg. 123345"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div id="new-password" className="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="new_password">
                  New password*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="password"
                  id="new_password"
                  className="form-input password-wrap"
                  name="new_password"
                />
                <div className="icon-wrapper">
                  <i
                    toggle="#new_password"
                    className="fas fa-eye toggle-password"
                  ></i>
                </div>
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div id="confirm-password" className="col-md-6">
              <div className="label-error-wrapper">
                <label className="input-label" for="confirm">
                  Confirm Password*:
                </label>
              </div>
              <div class="field-wrapper">
                <input
                  type="password"
                  id="confirm"
                  className="form-input password-wrap"
                  name="confirm"
                />
                <div className="icon-wrapper">
                  <i
                    toggle="#confirm"
                    className="fas fa-eye toggle-password"
                  ></i>
                </div>
              </div>

              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
            <div id="new-pass-req" class="col-md-12">
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
            <div id="redirect-new-pass" className="col-md-12">
              <p>Password successfully changed!</p>
              <p>
                To sign in click <Link to="/login">here</Link>
              </p>
            </div>
            <button
              className="send-code-btn login-btn-confirm"
              onClick={this.managePassword}
            >
              Send Code
            </button>
            <button
              className="confirm-password-btn login-btn-confirm"
              onClick={this.confirmCode}
            >
              Change Password
            </button>
            <hr className="hr-text" data-content="or" />
            <div className="reg-links">
              <Link to="/registration">Create a new account here</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;
