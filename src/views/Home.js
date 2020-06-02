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
    };
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
        console.log(this.state.user);
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
    console.log(this.state.user.username);
    await API.graphql(
      graphqlOperation(queries.getUser, {
        username: this.state.user.username,
      })
    )
      .then((res) => {
        console.log(res);
        if (res.data.getUser === null) {
          console.log(res);
          API.graphql(
            graphqlOperation(mutations.addUser, {
              input: {
                username: this.state.user.username,
                fullName: this.state.user.attributes.nickname,
                email: this.state.user.attributes.email,
              },
            })
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  resize = () => {
    this.forceUpdate();
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }
  logout = () => {
    Auth.signOut()
      .then((data) => this.props.history.push("/login"))
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
          <ChatModal closeModal={(newChat) => this.setState({ chatModal: false,  newChat: newChat})} />
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
                        path={`${this.props.match.path}/inbox/`}
                        render={() => (
                          <Inbox
                            onChange={(selectedItem) =>
                              this.setState({ selectedItem })
                            }
                            isMobile={isMobile}
                            modal={() => this.setState({ chatModal: true })}
                            newChat={this.state.newChat}
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

export default withRouter(Home);
