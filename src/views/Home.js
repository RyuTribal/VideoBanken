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
  wrapper: {
    height: "100%",
    minHeight: "100vh",
  },
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
      rooms: [],
      profileImg: null,
    };
    this.roomSubscription = "";
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
        this.props.history.push("/login");
      });
    this.roomSubscription = await API.graphql(
      graphqlOperation(subscriptions.deleteChatUser, {
        username: this.state.user.username,
      })
    ).subscribe({
      next: (res) => {
        this.props.history.push("/home/inbox");
        console.log(res);
        this.props.clear_selected_room();
        this.props.remove_subscription(res.value.data.deleteChatUser.roomId);
        this.props.remove_notifications(res.value.data.deleteChatUser.roomId);
        this.getRooms();
      },
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
      this.props.set_notifications(res.data.getUnreadMessages);
    });
    await this.getRooms();
    if (this.props.state.rooms.length > 0) {
      this.props.state.rooms.map((room, i) => {
        this.addSubcription(room.roomId);
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
    console.log(rooms);
    if (rooms.length > 0) {
      const currentUserInfo = JSON.parse(rooms[0].users).filter(
        (i) => i.username === this.state.username
      );
      rooms = rooms.map((room) => {
        room.users = JSON.parse(room.users).filter(
          (i) => i.username !== this.props.state.user.username
        );
        if (room.title.length !== 0 || room.title.trim()) {
          room.hasTitle = true;
        } else {
          room.hasTitle = false;
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
        }
        room.changeSub = API.graphql(
          graphqlOperation(subscriptions.detectRoomChange, {
            roomId: room.roomId,
          })
        ).subscribe({
          next: (res) => {
            this.getRooms();
          },
        });
        room.subscription = API.graphql(
          graphqlOperation(subscriptions.detectChangeUser, {
            roomId: room.roomId,
          })
        ).subscribe({
          next: (res) => {
            this.getRooms();
          },
        });
        const lastMessage = API.graphql(
          graphqlOperation(queries.getLastMessage, {
            chatId: room.roomId,
          })
        ).then((res) => {
          console.log(res);
          if (res.data.getLastMessage) {
            this.props.add_message(
              {
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
              },
              false
            );
          }
        });
        return room;
      });
    }
    this.props.set_rooms(rooms);
  };
  resize = () => {
    this.forceUpdate();
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    this.roomSubscription.unsubscribe();
  }
  logout = () => {
    Auth.signOut()
      .then((data) => {
        this.props.clear_state();
        this.props.history.push("/login");
      })
      .catch((err) => console.log(err));
  };
  closeModal = (isUploaded) => {
    if (this.state.playing === true) {
      this.state.playerRef.getInternalPlayer().play();
    }
    if (this.refs.fileUploader) {
      this.refs.fileUploader.value = "";
    }
    this.setState({ videoModal: false, playing: false });
    console.log(isUploaded);
    if (isUploaded) {
      this.props.history.push(
        `${this.props.match.path}/users/${this.props.state.user.username}/posts`
      );
    }
  };
  addSubcription = (id) => {
    this.props.add_subscription({
      id: id,
      subscription: API.graphql(
        graphqlOperation(subscriptions.notificationMessage, {
          chatId: id,
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
          if (
            res.value.data.notificationMessage.username !==
            this.state.user.username
          ) {
            this.props.add_message(
              {
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
              },
              true
            );
            const unreadId = res.value.data.notificationMessage.id;
            API.graphql(
              graphqlOperation(queries.getUnreadMessage, {
                id: unreadId,
                username: this.state.user.username,
              })
            ).then((res) => {
              console.log(res);
              if (
                res.data.getUnreadMessage &&
                res.data.getUnreadMessage.isRead === false
              ) {
                this.props.add_notification(res.data.getUnreadMessage);
              } else if (this.props.state.selectedRoom) {
                this.props.remove_notifications(
                  this.props.state.selectedRoom.roomId
                );
              }
            });
          }
        },
      }),
    });
  };
  render() {
    console.log(this.props.state);
    return (
      <div className={css(styles.wrapper)}>
        {this.state.chatModal && (
          <ChatModal
            closeModal={(newChat, id) => {
              if (newChat === true) {
                this.getRooms();
                this.addSubcription(id);
              }
              this.setState({ chatModal: false });
            }}
          />
        )}
        {this.state.videoModal === true && !isMobile && (
          <Modal closeModal={(isUploaded) => this.closeModal(isUploaded)} />
        )}
        {this.state.videoModal === true && isMobile && (
          <MobileModal
            closeModal={(isUploaded) => this.closeModal(isUploaded)}
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
                  mobileVideo: e.target.files[0],
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
          />
          <Column flexGrow={1} className={css(styles.mainBlock)}>
            <HeaderComponent
              usernickname={this.state.user.attributes.nickname}
              username={this.state.user.username}
              title={this.state.selectedItem}
              onChange={(selectedItem) =>
                this.setState({ selectedItem: selectedItem })
              }
              profileImg={this.state.profileImg}
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
                        path={`${this.props.match.path}/inbox/:id?/:settings?`}
                        render={(props) => (
                          <Inbox
                            {...props}
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                            modal={() => this.setState({ chatModal: true })}
                            getRooms={() => this.getRooms()}
                          />
                        )}
                      />
                      <Route
                        path={`${this.props.match.path}/users/:user/:tab?`}
                        render={() => (
                          <Profile
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                            changeProfile={(profileImg, fullName) => {
                              if(profileImg){
                                this.setState({profileImg: profileImg});
                              }
                              else if(fullName){
                                // this.setState({})
                              }
                              
                            }}
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
    add_message: (message, settingLast) =>
      dispatch({ type: "ADD_MESSAGE", message: message, settingLast: true }),
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
    add_user: (user) => dispatch({ type: "ADD_USER", user: user }),
    clear_state: () => dispatch({ type: "CLEAR_STATE" }),
    set_notifications: (notifications) =>
      dispatch({ type: "SET_NOTIFICATIONS", notifications: notifications }),
    add_notification: (notification) =>
      dispatch({ type: "ADD_NOTIFICATION", notification: notification }),
    remove_notifications: (id) =>
      dispatch({ type: "REMOVE_NOTIFICATIONS", id: id }),
    clear_selected_room: () => dispatch({ type: "CLEAR_SELECTED_ROOM" }),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
