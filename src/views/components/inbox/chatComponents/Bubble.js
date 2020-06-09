import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";

const styles = StyleSheet.create({
  container: {
    padding: 5,
    background: "black",
    color: "white",
    display: "flex"
  },
});
class Bubble extends Component {
  constructor() {
    super();
    this.state = {
      message: {},
    };
  }
  componentDidMount = () => {
    console.log(this.props.message);
    this.setState({ message: this.props.message });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.setState({ message: this.props.message });
    }
  };
  render() {
      console.log(this.state.message.text)
    return (
      <div className={css(styles.container)}>{this.state.message.text}</div>
    );
  }
}

export default Bubble;
