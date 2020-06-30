import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import blankProfile from "../../../img/blank-profile.png";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as subscriptions from "../../../graphql/subscriptions";
import { connect } from "react-redux";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    borderRight: "1px solid rgb(191, 156, 150)",
    "@media (max-width: 813px)": {
      borderRight: "none",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      borderRight: "none",
    },
  },
  headerContainer: {
    borderTop: "1px solid rgb(191, 156, 150)",
    borderBottom: "1px solid rgb(191, 156, 150)",
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  addChat: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    marginRight: "0px",
  },
  messagesContainer: {
    padding: 10,
  },
  messageBox: {
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    position: "relative",
    cursor: "pointer",
  },
  image: {
    width: 50,
    height: "100%",
    borderRadius: "50%",
  },
  nameMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  user: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "normal",
  },
  message: {
    color: "#666666",
  },
  active: {
    position: "absolute",
    right: "calc(0px - 10px)",
    height: "calc(100% + 20px)",
    top: "calc(0px - 10px)",
    width: 3,
    background: "#ea3a3a",
  },
  isRead: {
    color: "black",
    fontWeight: "bold",
  },
});

class Messages extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      chats: [],
      newestMessages: [],
    };
  }
  changeChat = (chat) => {
    if (chat) {
      this.props.history.push("/home/inbox/" + chat.roomId);
    }
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
  render() {
    console.log(this.props.state);
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.headerContainer)}>
          <h3 className={css(styles.header)}>Meddelanden</h3>
          <button
            onClick={() => this.props.modal()}
            className={css(styles.addChat)}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className={css(styles.messagesContainer)}>
          {this.props.state.rooms.map((chat, i) => (
            <MessageBox
              chosen={
                this.props.state.selectedRoom &&
                this.props.state.selectedRoom.roomId
              }
              chat={chat}
              lastMessage={chat.lastMessage && chat.lastMessage}
              onClick={() => {
                this.changeChat(chat);
              }}
              sendMessages={this.props.sendMessage}
            />
          ))}
        </div>
      </div>
    );
  }
}

class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      user: "",
      lastMessage: "",
      isRead: true,
    };
  }
  componentDidMount = async () => {
    console.log(this.props.chosenChat);
    const currentUser = await Auth.currentAuthenticatedUser();
    this.setState({ user: currentUser.username });
    console.log(this.props.chosen);
    if (this.props.chosen && this.props.chosen === this.props.chat.roomId) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
    if (this.props.lastMessage) {
      console.log(this.props.lastMessage);
      API.graphql(
        graphqlOperation(queries.getUnreadMessage, {
          id: this.props.lastMessage.id,
          username: this.state.user,
        })
      ).then((res) => {
        console.log(res);
        if (
          res.data.getUnreadMessage &&
          res.data.getUnreadMessage.isRead === false
        ) {
          this.setState({ isRead: false });
        }
      });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.chat.lastMessage !== prevProps.chat.lastMessage ||
      this.props.chosen !== prevProps.chosen ||
      this.props.lastMessage !== prevProps.lastMessage
    ) {
      console.log(this.props.chat);
      if (this.props.chosen === this.props.chat.roomId) {
        this.setState({ active: true });
      } else {
        this.setState({ active: false });
      }
      if (this.props.lastMessage) {
        console.log(this.props.lastMessage);
        API.graphql(
          graphqlOperation(queries.getUnreadMessage, {
            id: this.props.lastMessage.id,
            username: this.state.user,
          })
        ).then((res) => {
          console.log(res);
          if (
            res.data.getUnreadMessage &&
            res.data.getUnreadMessage.isRead === false
          ) {
            this.setState({ isRead: false });
          }
        });
      }
    }
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
  render() {
    return (
      <div
        onClick={() => this.props.onClick()}
        className={css(styles.messageBox)}
      >
        <img className={css(styles.image)} src={blankProfile}></img>
        <div className={css(styles.nameMessageWrapper)}>
          <div className={css(styles.name)}>
            {this.props.chat.title}{" "}
            {this.props.chat.users.length < 2 && (
              <span className={css(styles.user)}>{`@${
                this.props.chat.users && this.props.chat.users.length > 0
                  ? this.props.chat.users[0].username
                  : this.state.user
              }`}</span>
            )}
          </div>
          <div
            className={css(
              styles.message,
              this.state.isRead === false && styles.isRead
            )}
          >
            {!this.props.chat.lastMessage ||
            this.props.chat.lastMessage.text === ""
              ? "..."
              : this.props.chat.lastMessage.text}
          </div>
          {this.state.active && !this.isMobile() && (
            <div className={css(styles.active)}></div>
          )}
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
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Messages)
);
