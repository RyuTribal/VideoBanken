import React, { Component } from "react";
import { Link } from "react-router-dom";
class Start extends Component {
  render() {
    return (
      <div id="allWrapper">
        <div className="log-reg-buttons">
          <div className="start-btn">
            <Link className="btn-container login-btn" to="/registration">
              Get started
            </Link>
          </div>
          <div className="start-btn">
            <Link className="btn-container reg-btn" to="/login">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Start;
