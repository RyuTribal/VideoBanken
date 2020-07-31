import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";
import Input from "./Input";
import MessageBox from "./MessageBox";

const styles = StyleSheet.create({
  container: {
    height: "calc(100% - 5px)",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});
class Messages extends Component {
  render() {
    return (
      <div className={css(styles.container)}>
        <MessageBox />
        <Input onSend={this.props.onSend} />
      </div>
    );
  }
}

export default Messages;
