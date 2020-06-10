import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";
import Bubble from "./Bubble";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    width: "100%",
    flex: 100,
    overflow: "auto",
    flexDirection: "column",
  },
  bigtext: {
    fontSize: 100,
  },
});
class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.setState({ messages: this.props.messages });
    }
  };
  render() {
    return (
      <div className={css(styles.container)}>
        {this.state.messages.map((message, i) => (
          <Bubble message={message} key={i} />
        ))}
      </div>
    );
  }
}

export default MessageBox;
