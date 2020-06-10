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
import { GiftedChat, Bubble, Time } from "react-web-gifted-chat";
import blankProfile from "../../../img/blank-profile.png";
import { v4 as uuidv4 } from "uuid";
import Messages from "./chatComponents/Messages";
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
    flex: 3,
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
  message: {
    maxWidth: "100%",
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
  messages: {
    height: "100%",
  },
});
let subscription;
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      messages: [],
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
    if (subscription) {
      subscription.unsubscribe();
    }
    if (this.props && this.isMobile()) {
      this.setState(
        {
          profileImg: this.props.profileImg,
          fullName: this.props.fullName,
          id: this.props.id,
          users: this.props.users,
          title: this.props.title,
        },
        () => {
          subscription = API.graphql(
            graphqlOperation(subscriptions.addMessage, {
              chatId: this.state.id,
            })
          ).subscribe({
            next: (res) => {
              let currentMessage = res.value.data.addMessage;
              console.log(currentMessage);
              if (currentMessage.username === this.state.username) {
                let messages = this.state.messages;
                console.log(messages);
                for (let i = messages.length; i > 0; i--) {
                  if (messages[i].user.id === currentMessage.username) {
                    messages[i].sent = currentMessage.sent;
                    console.log(messages[i]);
                    break;
                  }
                }
                this.setState({ messages: messages });
              } else if (currentMessage.username !== this.state.username) {
                console.log("hey");
                if (currentMessage.profileImg === "null") {
                  currentMessage.profileImg = blankProfile;
                }
                this.setState((prevState) => ({
                  messages: [
                    ...prevState.messages,
                    {
                      id: currentMessage.id,
                      text: currentMessage.message,
                      createdAt: currentMessage.createdAt,
                      sent: currentMessage.sent,
                      user: {
                        id: currentMessage.username,
                        name: currentMessage.fullName,
                        avatar: currentMessage.profileImg,
                      },
                    },
                  ],
                }));
              }
            },
          });
        }
      );
      console.log(this.props);
      API.graphql(
        graphqlOperation(queries.getMessages, {
          id: this.props.id,
        })
      ).then((res) => {
        console.log(res.data.getMessages);
        let messageObjects = [];
        res.data.getMessages.map((message) => {
          if (message.profileImg === "null") {
            message.profileImg = blankProfile;
          }
          messageObjects.push({
            id: message.id,
            text: message.message,
            createdAt: message.createdAt,
            sent: message.sent,
            user: {
              id: message.username,
              name: message.fullName,
              avatar: message.profileImg,
            },
          });
        });
        messageObjects.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        this.setState({
          messages: messageObjects,
        });
      });
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
  componentWillReceiveProps = (props) => {
    if (props && !this.isMobile()) {
      console.log(props);
      let currentProps = props;
      if (subscription) {
        subscription.unsubscribe();
      }
      this.setState(
        {
          profileImg: currentProps.profileImg,
          fullName: currentProps.fullName,
          id: currentProps.id,
          users: currentProps.users,
          title: currentProps.title,
        },
        () => {
          subscription = API.graphql(
            graphqlOperation(subscriptions.addMessage, {
              chatId: this.state.id,
            })
          ).subscribe({
            next: (res) => {
              let currentMessage = res.value.data.addMessage;
              console.log(currentMessage);
              if (currentMessage.username === this.state.username) {
                let messages = this.state.messages;
                console.log(messages);
                for (let i = messages.length - 1; i >= 0; i--) {
                  console.log(i);
                  if (messages[i].sent === currentMessage.username) {
                    messages[i] = currentMessage;
                    break;
                  }
                }
                this.setState({ messages: messages });
                console.log(this.state.messages);
              } else if (currentMessage.username !== this.state.username) {
                console.log("hey");
                if (currentMessage.profileImg === "null") {
                  currentMessage.profileImg = blankProfile;
                }

                this.setState((prevState) => ({
                  messages: [
                    ...prevState.messages,
                    {
                      id: currentMessage.id,
                      text: currentMessage.message,
                      createdAt: currentMessage.createdAt,
                      sent: currentMessage.sent,
                      user: {
                        id: currentMessage.username,
                        name: currentMessage.fullName,
                        avatar: currentMessage.profileImg,
                      },
                    },
                  ],
                }));
              }
            },
          });
        }
      );
      API.graphql(
        graphqlOperation(queries.getMessages, {
          id: props.id,
        })
      ).then((res) => {
        console.log(res.data.getMessages);
        let messageObjects = [];
        res.data.getMessages.map((message) => {
          if (message.profileImg === "null") {
            console.log();
            message.profileImg = blankProfile;
          }
          messageObjects.push({
            id: message.id,
            text: message.message,
            createdAt: message.createdAt,
            sent: message.sent,
            user: {
              id: message.username,
              name: message.fullName,
              avatar: message.profileImg,
            },
          });
        });
        messageObjects.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        this.setState({
          messages: messageObjects,
        });
      });
    }
  };

  componentWillUnmount() {
    subscription.unsubscribe();
  }
  onSend = async (message) => {
    // Analytics.record({ name: "Chat MSG Sent" });
    if (message.length === 0 || !message.trim()) {
    } else {
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          {
            id: uuidv4(),
            text: message,
            createdAt: new Date(),
            sent: false,
            user: {
              id: this.state.username,
            },
          },
        ],
      }));
      console.log(this.state.messages);
      console.log(this.state.profileImg);
      await API.graphql(
        graphqlOperation(mutations.createMessage, {
          chatId: this.state.id,
          body: message,
          username: this.state.username,
          fullName: this.state.fullName,
          profileImg: this.state.profileImg,
        })
      ).then((res) => {
        console.log(res);
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
            maxWidth: 500,
          },
          left: {
            maxWidth: "1200px",
            maxWidth: "100%",
          },
        }}
      />
    );
  };
  customTime = (props) => {
    console.log(props);
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
    console.log(this.state.messages)
    return (
      <div className={css(styles.container)}>
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
            {this.state.title}{" "}
            {this.state.users.length < 2 && this.state.users.length > 0 && (
              <span
                className={css(styles.headerUser)}
              >{`@${this.state.users[0].username}`}</span>
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
        <Messages messages={this.state.messages} />
        {/* {this.state.id ? (
          <GiftedChat
            maxInputLength={250}
            className={css(styles.messages)}
            messages={this.state.messages}
            renderUsernameOnMessage={true}
            placeholder="Skriv ett meddelande här..."
            onSend={(messages) => this.onSend(messages[0].text)}
            user={{
              id: this.state.username,
            }}
            inverted={false}
            renderBubble={this.customBubble}
            renderTime={this.customTime}
          />
        ) : (
          <div>Välj ett run och börja chatta i</div>
        )} */}
      </div>
    );
  }
}

export default Chat;
