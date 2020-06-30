import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { Auth, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import VideoUpload from "./VideoUpload";
import HomeFeed from "./HomeFeed";
import Team from "./Team";
import Watch from "./Watch";
import Profile from "./Profile";
import Inbox from "./Inbox";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import SidebarComponent from "./components/sidebar/SidebarComponent";
import HeaderComponent from "./components/header/HeaderComponent";
import Modal from "./components/modal/Modal";
import ChatModal from "./components/inbox/ChatModal";
import MobileModal from "./components/modal/MobileModal";
import { connect } from "react-redux";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    minHeight: "100vh",
  },
  content: {
    marginTop: 0,
    overflowY: "auto",
    overflowX: "hidden",
    height: "100vh",
    zIndex: 5,
  },
  mainBlock: {
    backgroundColor: "#F7F8FC",
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        username: "",
        attributes: {
          nickname: "",
        },
      },
      videoModal: false,
      selectedItem: "",
      playerRef: null,
      playing: false,
      mobileVideo: "",
      chatModal: false,
      newChat: false,
      notifications: [],
      rooms: [],
    };
    this.subscriptions = [];
  }
  componentDidMount = async () => {
    window.addEventListener("resize", this.resize);
    await Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        this.setState({
          user: { username: user.username, attributes: user.attributes },
        });
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
    await API.graphql(
      graphqlOperation(queries.getUser, {
        username: this.state.user.username,
      })
    )
      .then((res) => {
        if (res.data.getUser === null && this.state.user.username !== "") {
          API.graphql(
            graphqlOperation(mutations.addUser, {
              input: {
                username: this.state.user.username,
                fullName: this.state.user.attributes.nickname,
                email: this.state.user.attributes.email,
              },
            })
          )
            .then((res) => {
              this.props.add_user(res.data.addUser);
            })
            .catch((err) => console.log(err));
        } else {
          this.props.add_user(res.data.getUser);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    await API.graphql(
      graphqlOperation(queries.getUnreadMessages, {
        username: this.state.user.username,
      })
    ).then((res) => {
      this.setState({ notifications: res.data.getUnreadMessages });
    });
    await this.getRooms();
    if (this.props.state.rooms.length > 0) {
      this.props.state.rooms.map((room, i) => {
        this.props.add_subscription({
          id: room.roomId,
          subscription: API.graphql(
            graphqlOperation(subscriptions.notificationMessage, {
              chatId: room.roomId,
            })
          ).subscribe({
            next: (res) => {
              if (
                res.value.data.notificationMessage.username !==
                this.state.user.username
              ) {
                this.props.add_message({
                  id: res.value.data.notificationMessage.id,
                  text: res.value.data.notificationMessage.message,
                  createdAt: res.value.data.notificationMessage.createdAt,
                  chatId: res.value.data.notificationMessage.chatId,
                  // sent: currentMessage.sent,
                  user: {
                    id: res.value.data.notificationMessage.username,
                    name: res.value.data.notificationMessage.fullName,
                    avatar: res.value.data.notificationMessage.profileImg,
                  },
                });
                API.graphql(
                  graphqlOperation(queries.getUnreadMessage, {
                    id: res.value.data.notificationMessage.id,
                    username: this.state.user.username,
                  })
                ).then((res) => {
                  if (res.data.getUnreadMessage) {
                    this.setState((prevState) => ({
                      notifications: [
                        ...prevState.notifications,
                        res.data.getUnreadMessage,
                      ],
                    }));
                  }
                });
              }
            },
          }),
        });
      });
      if (this.props.match.params.id) {
        this.props.change_room(JSON.parse(this.props.match.params.id));
      }
    }
  };
  getRooms = async () => {
    let rooms = await API.graphql(
      graphqlOperation(queries.getRooms, {
        username: this.state.user.username,
      })
    ).then((res) => {
      return res.data.getRooms;
    });
    if (rooms.length > 0) {
      const currentUserInfo = JSON.parse(rooms[0].users).filter(
        (i) => i.username === this.state.username
      );
      rooms = rooms.map((room) => {
        room.users = JSON.parse(room.users).filter(
          (i) => i.username !== this.props.state.user.username
        );
        if (room.users.length === 1) {
          room.title = room.users[0].fullName;
        } else if (room.users.length > 1) {
          let nameArray = [];
          room.users.map((user) => {
            nameArray.push(user.fullName.split(" ")[0]);
          });
          room.title =
            nameArray.join(", ").length > 50
              ? nameArray.join(", ").substr(0, 50 - 1) + "..."
              : nameArray.join(", ");
        } else if (room.users.length < 1) {
          room.title = "Jag";
        }
        return room;
      });
      if (rooms.length > 0) {
        this.props.set_rooms(rooms);
        this.props.state.rooms.map((room) => {
          const lastMessage = API.graphql(
            graphqlOperation(queries.getLastMessage, {
              chatId: room.roomId,
            })
          ).then((res) => {
            console.log(res);
            if (res.data.getLastMessage) {
              this.props.add_message({
                id: res.data.getLastMessage.id,
                text: res.data.getLastMessage.message,
                createdAt: res.data.getLastMessage.createdAt,
                chatId: res.data.getLastMessage.chatId,
                // sent: currentMessage.sent,
                user: {
                  id: res.data.getLastMessage.username,
                  name: res.data.getLastMessage.fullName,
                  avatar: res.data.getLastMessage.profileImg,
                },
              });
            }
          });
        });

        console.log(this.props.state);
      }
    }
  };
  resize = () => {
    this.forceUpdate();
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    this.subscriptions.map((subscription) => {
      subscription.subscription.unsubscribe();
    });
  }
  logout = () => {
    Auth.signOut()
      .then((data) => {
        this.props.clear_state();
        this.props.history.push("/login");
      })
      .catch((err) => console.log(err));
  };
  closeModal = () => {
    if (this.state.playing === true) {
      this.state.playerRef.getInternalPlayer().play();
    }
    if (this.refs.fileUploader) {
      this.refs.fileUploader.value = "";
    }
    this.setState({ videoModal: false, playing: false });
  };
  render() {
    return (
      <BrowserRouter>
        {this.state.chatModal && (
          <ChatModal
            closeModal={(newChat) =>
              this.setState({ chatModal: false, newChat: newChat })
            }
          />
        )}
        {this.state.videoModal === true && !isMobile && (
          <Modal closeModal={this.closeModal} />
        )}
        {this.state.videoModal === true && isMobile && (
          <MobileModal
            closeModal={this.closeModal}
            video={this.state.mobileVideo}
          />
        )}
        {isMobile && (
          <input
            id="video-uploader"
            type="file"
            className="upload"
            accept="video/*"
            style={{ display: "none" }}
            ref="fileUploader"
            onChange={(e) => {
              if (e.target.files[0]) {
                this.setState({
                  videoModal: true,
                  mobileVideo: URL.createObjectURL(e.target.files[0]),
                });
              }
            }}
          ></input>
        )}
        <Row id="wrapper" className={css(styles.container)}>
          <SidebarComponent
            selectedItem={this.state.selectedItem}
            username={this.state.user.username}
            logout={this.logout}
            notifications={this.state.notifications}
          />
          <Column flexGrow={1} className={css(styles.mainBlock)}>
            <HeaderComponent
              usernickname={this.state.user.attributes.nickname}
              username={this.state.user.username}
              title={this.state.selectedItem}
              onChange={(selectedItem) =>
                this.setState({ selectedItem: selectedItem })
              }
              videoModal={() => {
                if (this.state.playerRef !== null) {
                  if (this.state.playerRef.player.props.playing === true) {
                    this.setState({ playing: true });
                    this.state.playerRef.getInternalPlayer().pause();
                  }
                }
                if (isMobile) {
                  this.refs.fileUploader.click();
                } else {
                  this.setState({ videoModal: true });
                }
              }}
            />
            <div className={css(styles.content)}>
              <Route
                render={(props) => {
                  return (
                    <Switch>
                      <Route
                        exact
                        path={this.props.match.path}
                        render={() => (
                          <HomeFeed
                            user={this.state.user}
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem: selectedItem })
                            }
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/video-upload`}
                        render={() => (
                          <VideoUpload
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem: selectedItem })
                            }
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/watch/:video`}
                        render={() => (
                          <Watch
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem: selectedItem })
                            }
                            playerRef={(playerRef) =>
                              this.setState({ playerRef: playerRef })
                            }
                            container={styles.content}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/inbox/:id?`}
                        render={(props) => (
                          <Inbox
                            {...props}
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                            modal={() => this.setState({ chatModal: true })}
                            newChat={this.state.newChat}
                            updateNotifications={(id) => {
                              console.log("we here");
                              let notificationsArray = this.state.notifications;
                              notificationsArray.filter(function (el) {
                                return el.recepient_group_id !== id;
                              });
                              this.setState({
                                notifications: notificationsArray,
                              });
                            }}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/users/:user`}
                        render={() => (
                          <Profile
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/team/`}
                        render={() => (
                          <Team
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                          />
                        )}
                      />
                    </Switch>
                  );
                }}
              />
            </div>
          </Column>
        </Row>
      </BrowserRouter>
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
    add_user: (user) => dispatch({ type: "ADD_USER", user: user }),
    clear_state: () => dispatch({ type: "CLEAR_STATE" }),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
