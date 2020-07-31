import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";
import Bubble from "./Bubble";
import { connect } from "react-redux";
import $ from "jquery";

const styles = StyleSheet.create({
  container: {
    overflowY: "auto",
    display: "flex",
    alignItems: "flex-end",
  },
  bigtext: {
    fontSize: 100,
  },
  bubbleContainer: {
    overflow: "auto",
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column-reverse",
    "-webkit-flex-direction": "column-reverse",
    margin: "0",
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
  render() {
    console.log(this.props.state);
    return (
      <div ref={this.bubbleContainerRef} className={css(styles.container)}>
        <div className={css(styles.bubbleContainer) + " testing"}>
          {this.props.state.selectedRoom.messages &&
            this.props.state.selectedRoom.messages.map((message, i) => (
              <Bubble
                message={message}
                prevMessage={
                  this.props.state.selectedRoom.messages[i + 1] &&
                  this.props.state.selectedRoom.messages[i + 1]
                }
                key={i}
              />
            ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: state,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    set_rooms: (rooms) => dispatch({ type: "SET_ROOMS", rooms: rooms }),
    add_room: (room) => dispatch({ type: "ADD_ROOM", room: room }),
    remove_room: (id) => dispatch({ type: "REMOVE_ROOM", id, id }),
    add_subscription: (subscription) =>
      dispatch({ type: "ADD_SUBSCRIPTION", subscription: subscription }),
    remove_subscription: (id) =>
      dispatch({ type: "REMOVE_SUBSCRIPTION", id: id }),
    add_message: (message) =>
      dispatch({ type: "ADD_MESSAGE", message: message }),
    change_room: (id) => dispatch({ type: "CHANGE_MESSAGE", id: id }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);
