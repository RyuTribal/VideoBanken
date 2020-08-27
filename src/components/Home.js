import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";

class Home extends Component {
  componentDidMount = async () => {
    this.props.setTitle("Feed", "Feed");
    await Auth.currentAuthenticatedUser().catch(() =>
      this.props.history.push("/login")
    );
  };
  render() {
    return <div>Hey</div>;
  }
}

export default withRouter(Home);
