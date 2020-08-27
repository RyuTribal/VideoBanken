import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      isUser: false,
    };
  }
  componentDidMount = async () => {
    this.props.setTitle(`@${this.props.match.params.username}`, `User`);
    await Auth.currentAuthenticatedUser().catch(() =>
      this.props.history.push("/login")
    );
  };
  render() {
    return <div>user</div>;
  }
}

export default withRouter(Users);
