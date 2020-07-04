import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import SendMessage from "./SendMessage";
import { Connect } from "aws-amplify-react";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import * as subscriptions from "../../../graphql/subscriptions";
import { GiftedChat, Bubble, Time, InputToolbar } from "react-web-gifted-chat";
import blankProfile from "../../../img/blank-profile.png";
import { v4 as uuidv4 } from "uuid";
import Messages from "./chatComponents/Messages";
import { connect } from "react-redux";
const blinking = {
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
};
const styles = StyleSheet.create({
  container: {
    height: "calc(100% - 60px)",
    flex: 2,
  },
  headerContainer: {
    borderTop: "1px solid rgb(191, 156, 150)",
    borderBottom: "1px solid rgb(191, 156, 150)",
    minHeight: "58.08px",
    "@media (max-width: 813px)": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
  },
  headerName: {
    display: "inline-block",
    marginLeft: 10,
    "@media (max-width: 813px)": {
      marginRight: "auto",
      marginLeft: "auto",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      marginRight: "auto",
      marginLeft: "auto",
    },
  },
  headerUser: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "normal",
    cursor: "pointer",
  },
  headerLeftButton: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    marginLeft: "0px",
  },
  headerRightButton: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    marginRight: "0px",
  },
  messageTimeWrapper: {
    display: "flex",
    flexDirection: "row",
    color: "#ffffff",
  },
  messageStatus: {
    marginRight: 5,
    fontSize: 10,
  },
  sent: {
    color: "#909090",
  },
  read: {
    color: "#4BB543",
  },
  sending: {
    color: "#909090",
    animationName: [blinking],
    animationDuration: "1s",
    animationIterationCount: "infinite",
  },
  message: {
    maxWidth: "100%",
  },
  emptyChat: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontSize: 20,
  },
  newChat: {
    background: "#ea3a3a",
    padding: "10px 20px",
    fontSize: "1.5em",
    border: 0,
    transition: "0.4s",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    ":hover": {
      backgroundColor: "#ff5050",
      transition: "0.4s",
    },
    ":focus": {
      outline: "none",
    },
    ":disabled": {
      backgroundColor: "rgb(245, 244, 242)",
      color: "rgb(177, 172, 163)",
    },
  },
});
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      id: null,
      users: [],
      title: "",
      fullName: "",
      profileImg: "",
    };
  }
  componentDidMount = async () => {
    const { username } = await Auth.currentAuthenticatedUser();

    this.setState({
      username: username,
    });
  };
  isMobile = () => {
    if (
      window.matchMedia("(max-width: 813px)").matches ||
      window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
        .matches
    ) {
      return true;
    } else {
      return false;
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.state.selectedRoom !== this.props.state.selectedRoom) {
      // this.setState({
      //   profileImg: this.props.profileImg,
      //   fullName: this.props.fullName,
      //   id: this.props.id,
      //   users: this.props.users,
      //   title: this.props.title,
      // });
      // API.graphql(
      //   graphqlOperation(mutations.changeReadStatus, {
      //     id: this.props.id,
      //     username: this.state.username,
      //   })
      // ).then((res) => {
      //   console.log(res);
      //   this.props.updateNotifications(this.props.id);
      // });
      if (this.props.state.selectedRoom) {
        API.graphql(
          graphqlOperation(queries.getMessages, {
            id: this.props.state.selectedRoom.roomId,
          })
        ).then((res) => {
          let messageObjects = [];
          res.data.getMessages.map((message) => {
            messageObjects.push({
              id: message.id,
              text: message.message,
              createdAt: message.createdAt,
              chatId: message.chatId,
              // sent: message.sent,
              user: {
                id: message.username,
                name: message.fullName,
                avatar: message.profileImg,
              },
            });
          });
          this.props.set_messages(messageObjects);
        });
      }
    }
  };
  onSend = async (message) => {
    // Analytics.record({ name: "Chat MSG Sent" });
    if (message.length === 0 || !message.trim()) {
    } else {
      await API.graphql(
        graphqlOperation(mutations.createMessage, {
          chatId: JSON.parse(this.props.state.selectedRoom.roomId),
          body: message,
          username: this.props.state.user.username,
          fullName: this.props.state.user.fullName,
          profileImg: this.props.state.user.profileImg,
        })
      ).then((res) => {
        this.props.add_message(
          {
            id: res.data.createMessage.id,
            text: res.data.createMessage.message,
            createdAt: res.data.createMessage.createdAt,
            chatId: res.data.createMessage.chatId,
            // sent: currentMessage.sent,
            user: {
              id: res.data.createMessage.username,
              name: res.data.createMessage.fullName,
              avatar: res.data.createMessage.profileImg,
            },
          },
          true
        );
      });
    }
  };
  customBubble = (props) => {
    return (
      <Bubble
        {...props}
        tickStyle={{
          color: "white",
        }}
        wrapperStyle={{
          right: {
            backgroundColor: "rgb(38, 48, 64)",
            display: "block",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
          },
        }}
      />
    );
  };
  customTime = (props) => {
    return (
      <div className={css(styles.messageTimeWrapper)}>
        <Time {...props} />
        {props.currentMessage.user.id === this.state.username && (
          <div>
            {!props.currentMessage.sent && (
              <div className={css(styles.messageStatus, styles.sending)}>
                <i className="fas fa-ellipsis-h"></i>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  render() {
    if (this.props.state.selectedRoom) {
      API.graphql(
        graphqlOperation(mutations.changeReadStatus, {
          username: this.props.state.user.username,
          id: this.props.state.selectedRoom.roomId,
        })
      ).then((res) => {
        this.props.remove_notifications(this.props.state.selectedRoom.roomId);
      });
    }
    return (
      <div className={css(styles.container) + " test"}>
        {this.props.state.selectedRoom ? (
          <div className={css(styles.headerContainer)}>
            {this.isMobile() && (
              <button
                onClick={this.props.back}
                className={css(styles.headerLeftButton)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            )}

            <h3 className={css(styles.headerName)}>
              {this.props.state.selectedRoom.title}{" "}
              {this.props.state.selectedRoom.length < 2 &&
                this.props.state.selectedRoom.length > 0 && (
                  <span
                    className={css(styles.headerUser)}
                  >{`@${this.props.state.selectedRoom.users[0].username}`}</span>
                )}
            </h3>
            {this.isMobile() && (
              <button
                onClick={this.props.back}
                className={css(styles.headerRightButton)}
              >
                <i className="fas fa-cog"></i>
              </button>
            )}
          </div>
        ) : (
          ""
        )}
        {this.props.state.selectedRoom ? (
          <Messages onSend={this.onSend} />
        ) : (
          <div className={css(styles.emptyChat)}>
            Inget rum vald. Välj ett rum eller
            <button className={css(styles.newChat)} onClick={this.props.modal}>
              Skapa ett nytt rum
            </button>
          </div>
        )}
      </div>
    );
  }
}

Object.defineProperty(Date.prototype, "YYYYMMDDHHMMSS", {
  value: function () {
    function pad2(n) {
      // always returns a string
      return (n < 10 ? "0" : "") + n;
    }

    return `${this.getFullYear()}-${pad2(this.getMonth() + 1)}-${pad2(
      this.getDate()
    )} ${pad2(this.getHours())}:${pad2(this.getMinutes())}:${pad2(
      this.getSeconds()
    )}`;
  },
});

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
    add_message: (message, settingLast) =>
      dispatch({
        type: "ADD_MESSAGE",
        message: message,
        settingLast: settingLast,
      }),
    set_messages: (messages) =>
      dispatch({ type: "SET_MESSAGES", messages: messages }),
    remove_notifications: (id) =>
      dispatch({ type: "REMOVE_NOTIFICATIONS", id: id }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
