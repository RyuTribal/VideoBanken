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
    flex: 100,
    overflow: "auto",
  },
  bigtext: {
    fontSize: 100,
  },
  bubbleContainer: {
    overflow: "auto",
    height: "100%",
    display: "flex",
    flexDirection: "column-reverse",
  },
});
class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
    this.bubbleContainerRef = React.createRef();
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.setState({ messages: this.props.messages }, () => {
        this.bubbleContainerRef.current.scrollTop = this.bubbleContainerRef.current.scrollHeight;
      });
    }
  };
  render() {
    return (
      <div ref={this.bubbleContainerRef} className={css(styles.container)}>
        <div className={css(styles.bubbleContainer)}>
          {this.state.messages.map((message, i) => (
            <Bubble
              message={message}
              prevMessage={this.state.messages[i + 1]}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MessageBox;
