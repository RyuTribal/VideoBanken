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
import { Auth } from "aws-amplify";

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
});

class Messages extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      chats: [],
      chatChosen: "",
    };
  }
  componentDidMount = () => {
    if (this.isMobile()) {
      this.setState({
        chats: this.props.chats,
        chatChosen: this.props.chosenChat,
      });
    }
  };
  componentWillReceiveProps = async (props) => {
    this.setState({ chats: props.chats, chatChosen: props.chosenChat });
  };
  componentWillUnmount() {}
  changeChat = (chat) => {
    console.log(chat);
    if (chat) {
      this.setState({ chatChosen: chat.roomId });
      this.props.changeChat(chat);
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
          {this.state.chats.map((chat, i) => (
            <MessageBox
              chosen={this.state.chatChosen}
              chat={chat}
              onClick={() => this.changeChat(chat)}
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
    };
  }
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    this.setState({ user: currentUser.username });
    if (this.props.chosen && this.props.chosen === this.props.chat.roomId) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  };
  componentWillReceiveProps = (props) => {
    if (props.chosen && props.chosen === props.chat.roomId) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
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
    console.log(this.props.chat);
    return (
      <div onClick={this.props.onClick} className={css(styles.messageBox)}>
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
          <div className={css(styles.message)}>
            Ivan: Hey man whats going o...
          </div>
          {this.state.active && !this.isMobile() && (
            <div className={css(styles.active)}></div>
          )}
        </div>
      </div>
    );
  }
}

export default Messages;
