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
import Watch from "./Watch";
import Profile from "./Profile";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import SidebarComponent from "./components/sidebar/SidebarComponent";
import HeaderComponent from "./components/header/HeaderComponent";
import Modal from "./components/modal/Modal";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    minHeight: "100vh",
  },
  content: {
    marginTop: 54,
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
        if (res.data.getUser === null) {
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
      .catch((err) => {});
  };

  resize = () => this.forceUpdate();
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
    this.setState({ videoModal: false, playing: false });
  };
  render() {
    return (
      <BrowserRouter>
        {this.state.videoModal === true && isMobile === false && (
          <Modal closeModal={this.closeModal} />
        )}
        <Row id="wrapper" className={css(styles.container)}>
          <SidebarComponent
            isMobile={isMobile}
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
                this.setState({ videoModal: true });
              }}
            />
            <div className={css(styles.content)}>
              <div className={css(styles.padded)}>
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
                            />
                          )}
                        />
                      </Switch>
                    );
                  }}
                />
              </div>
            </div>
          </Column>
        </Row>
      </BrowserRouter>
    );
  }
}

export default withRouter(Home);
