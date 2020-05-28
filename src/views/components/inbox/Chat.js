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
import { Auth, graphqlOperation, API } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import * as subscriptions from "../../../graphql/subscriptions";
import { GiftedChat } from "react-web-gifted-chat";
import blankProfile from "../../../img/blank-profile.png";

const styles = StyleSheet.create({
  container: {
    height: "calc(100% - 60px)",
    width: "100%",
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
      API.graphql(
        graphqlOperation(queries.getMessages, {
          id: this.props.id,
        })
      ).then((res) => {
        console.log(res.data.getMessages);
        let messageObjects = [];
        res.data.getMessages.map((message) => {
          if (message.userInfo[0].profileImg === null) {
            message.userInfo[0].profileImg = blankProfile;
          }
          messageObjects.push({
            id: message.id,
            text: message.message,
            createdAt: message.createdAt,
            user: {
              id: message.userInfo[0].username,
              name: message.userInfo[0].fullName,
              avatar: message.userInfo[0].profileImg,
            },
          });
        });
        this.setState(
          {
            id: this.props.id,
            users: this.props.users,
            title: this.props.title,
            messages: messageObjects,
          },
          () => {
            subscription = API.graphql(
              graphqlOperation(subscriptions.addMessage, {
                chatId: this.state.id,
              })
            ).subscribe({
              next: (res) => {
                console.log(res);
                let currentMessage = res.value.data.addMessage;
                console.log(currentMessage);
                if (currentMessage.username === this.state.username) {
                  this.setState((prevState) => ({
                    messages: [
                      ...prevState.messages,
                      {
                        id: currentMessage.id,
                        text: currentMessage.message,
                        createdAt: currentMessage.createdAt,
                        user: {
                          id: this.state.username,
                          name: this.state.username,
                        },
                      },
                    ],
                  }));
                } else {
                  API.graphql(
                    graphqlOperation(queries.getUser, {
                      username: currentMessage.username,
                    })
                  ).then((res) => {
                    if (res.data.getUser.profileImg === null) {
                      res.data.getUser.profileImg = blankProfile;
                    }
                    this.setState((prevState) => ({
                      messages: [
                        ...prevState.messages,
                        {
                          id: currentMessage.id,
                          text: currentMessage.message,
                          createdAt: currentMessage.createdAt,
                          user: {
                            id: res.data.getUser.username,
                            name: res.data.getUser.fullName,
                            avatar: res.data.getUser.profileImg,
                          },
                        },
                      ],
                    }));
                  });
                }
              },
            });
          }
        );
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
    if (subscription) {
      subscription.unsubscribe();
    }
    let currentProps = props;
    console.log(props);
    if (props) {
      API.graphql(
        graphqlOperation(queries.getMessages, {
          id: props.id,
        })
      ).then((res) => {
        console.log(res.data.getMessages);
        let messageObjects = [];
        res.data.getMessages.map((message) => {
          if (message.userInfo[0].profileImg === null) {
            message.userInfo[0].profileImg = blankProfile;
          }
          messageObjects.push({
            id: message.id,
            text: message.message,
            createdAt: message.createdAt,
            user: {
              id: message.userInfo[0].username,
              name: message.userInfo[0].fullName,
              avatar: message.userInfo[0].profileImg,
            },
          });
        });
        this.setState(
          {
            id: currentProps.id,
            users: currentProps.users,
            title: currentProps.title,
            messages: messageObjects,
          },
          () => {
            subscription = API.graphql(
              graphqlOperation(subscriptions.addMessage, {
                chatId: this.state.id,
              })
            ).subscribe({
              next: (res) => {
                console.log(res);
                let currentMessage = res.value.data.addMessage;
                console.log(currentMessage);
                if (currentMessage.username === this.state.username) {
                  this.setState((prevState) => ({
                    messages: [
                      ...prevState.messages,
                      {
                        id: currentMessage.id,
                        text: currentMessage.message,
                        createdAt: currentMessage.createdAt,
                        user: {
                          id: this.state.username,
                          name: this.state.username,
                        },
                      },
                    ],
                  }));
                } else {
                  API.graphql(
                    graphqlOperation(queries.getUser, {
                      username: currentMessage.username,
                    })
                  ).then((res) => {
                    if (res.data.getUser.profileImg === null) {
                      res.data.getUser.profileImg = blankProfile;
                    }
                    this.setState((prevState) => ({
                      messages: [
                        ...prevState.messages,
                        {
                          id: currentMessage.id,
                          text: currentMessage.message,
                          createdAt: currentMessage.createdAt,
                          user: {
                            id: res.data.getUser.username,
                            name: res.data.getUser.fullName,
                            avatar: res.data.getUser.profileImg,
                          },
                        },
                      ],
                    }));
                  });
                }
              },
            });
          }
        );
      });
    }
  };

  componentWillUnmount() {}
  onSend = async (message) => {
    await API.graphql(
      graphqlOperation(mutations.createMessage, {
        chatId: this.state.id,
        body: message,
        username: this.state.username,
      })
    ).then((res) => {});
  };
  render() {
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
        />
      </div>
    );
  }
}

export default Chat;
