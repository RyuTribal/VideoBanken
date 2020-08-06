import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import CoverPhoto from "./components/profile/CoverPhoto";
import Stats from "./components/profile/Stats";
import Games from "./components/profile/Games";
import Posts from "./components/profile/Posts";
import Modal from "./components/profile/ProfileTextModal";
import { StyleSheet, css } from "aphrodite";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import Followers from "./components/profile/Followers";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    margin: "0 auto",
  },
  presentation: {
    height: "30%",
  },
  editableInfo: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    "@media (max-width: 813px)": {
      flexDirection: "column",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      flexDirection: "column",
    },
  },
  bodyStats: {
    flex: "2",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "@media (max-width: 813px)": {
      flex: "unset",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      flex: "unset",
    },
  },
  name: {
    paddingTop: 20,
    fontSize: 20,
  },
  username: {
    color: "#666666",
  },
  heightWeightWrapper: {
    "@media (max-width: 813px)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
  },
  heightWeight: {
    color: "#666666",
    fontSize: 16,
    marginTop: "2%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  description: {
    flex: "5",
    "@media (max-width: 813px)": {
      flex: "unset",
      paddingLeft: 15,
      paddingRight: 15,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      flex: "unset",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  teamError: {
    color: "#666666",
    fontSize: 16,
    marginTop: "10%",
    fontStyle: "italic",
    "@media (max-width: 813px)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  followWrapper: {
    display: "flex",
    alignItems: "center",
    "@media (max-width: 813px)": {
      flexDirection: "column",
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      alignItems: "flex-start",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      flexDirection: "column",
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      alignItems: "flex-start",
    },
  },
  callToAction: {
    background: "#ea3a3a",
    padding: "10px 20px",
    boxSizing: "border-box",
    fontSize: 15,
    border: 0,
    transition: "0.4s",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    cursor: "pointer",
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
    "@media (max-width: 813px)": {
      width: "100%",
      marginTop: 20,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      width: "100%",
      marginTop: 20,
    },
  },
  followsButton: {
    background: "unset",
    color: "black",
    border: "1px solid #ea3a3a",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  followersWrapper: {
    display: "flex",
    flexDirection: "row",
    "@media (max-width: 813px)": {
      marginTop: 20,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      marginTop: 20,
    },
  },
  followers: {
    marginLeft: 20,
    fontSize: 18,
    color: "#666666",
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
    "@media (max-width: 813px)": {
      marginLeft: 0,
      ":last-of-type": {
        marginLeft: 20,
      },
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      marginLeft: 0,
      ":last-of-type": {
        marginLeft: 20,
      },
    },
  },
  ammountFollowers: {
    color: "rgb(38, 48, 64)",
    fontWeight: "700",
    display: "inline-block",
  },
  userDesc: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    "@media (max-width: 813px)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
  },
  emptyDesc: {
    color: "#666666",
    fontStyle: "italic",
  },
  statsHeader: {
    color: "#434343",
  },
  statsWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 0,
    justifyContent: "flex-start",
    "@media (max-width: 813px)": {
      width: "100%",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      width: "100%",
    },
  },
  bestStats: {
    flex: "1",
    height: 140,
    background: "#efefef",
    margin: 10,
    marginLeft: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 240,
    flexDirection: "column",
    "@media (max-width: 376px)": {
      height: "auto",
      padding: "1%",
    },
  },
  statDesc: {
    fontSize: 15,
    color: "#666666",
    "@media (max-width: 376px)": {
      fontSize: 10,
    },
  },
  statsAmmount: {
    fontSize: 22,
    fontWeight: "700",
    "@media (max-width: 376px)": {
      fontSize: 15,
    },
  },
  menuesWrapper: {
    width: "100%",
  },

  menuNav: {
    display: "flex",
    zIndex: 999,
    background: "#fbf9f9",
    "@media (max-width: 813px)": {
      position: "sticky",
      top: 0,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      position: "sticky",
      top: 0,
    },
  },
  menuItem: {
    flex: "1",
    color: "rgb(38, 48, 64)",
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 17,
    cursor: "pointer",
    transition: "0.2s",
    borderBottom: "2px solid rgb(38, 48, 64)",
    ":hover": {
      background: "rgb(38, 48, 64)",
      color: "#fbf9f9",
      transition: "0.2s",
    },
    "-webkit-touch-callout": "none",
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    "@media (max-width: 813px)": {
      fontSize: 13,
    },
  },
  active: {
    background: "rgb(38, 48, 64)",
    color: "#fbf9f9",
    transition: "0.2s",
  },
  menuResults: {
    height: "100%",
  },
  isFollowing: {
    color: "#666666",
    padding: "10px 0px",
  },
});
const initialState = {
  user: "",
  userInfo: {},
  userExists: true,
  userProfile: false,
  modal: false,
  follows: false,
  following: false,
  followersModal: false,
};
class Profile extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  componentDidMount = async () => {
    this.setState({
      user: this.props.match.params.user,
    });
    const currentUser = await Auth.currentAuthenticatedUser();
    if (currentUser.username === this.props.match.params.user) {
      this.setState({ userProfile: true });
    } else {
      this.setState({ userProfile: false });
    }
    this.props.onChange(`@${this.props.match.params.user}`);
    await API.graphql(
      graphqlOperation(queries.getUser, {
        username: this.props.match.params.user,
      })
    )
      .then((res) => {
        if (res.data.getUser === null) {
          this.setState({ userExists: false });
        } else {
          this.setState({ userInfo: res.data.getUser });
        }

        console.log(res.data.getUser);
      })
      .catch((err) => this.setState({ userExists: false }));
    if (!this.state.userProfile && this.props.state.user) {
      this.getFollows();
    }
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.match.params.user !== this.props.match.params.user) {
      this.setState(initialState);
      this.componentDidMount();
    }
    if (prevProps.state.user !== this.props.state.user) {
      this.getFollows();
    }
  };
  getFollows = async () => {
    if (this.props.state.user) {
      await API.graphql(
        graphqlOperation(queries.getFollower, {
          username: this.props.state.user.username,
          follows: this.state.userInfo.username,
        })
      ).then((res) => {
        console.log(res);
        if (res.data.getFollower) {
          this.setState({ following: true });
        }
      });
      await API.graphql(
        graphqlOperation(queries.getFollower, {
          username: this.state.userInfo.username,
          follows: this.props.state.user.username,
        })
      ).then((res) => {
        console.log(res);
        if (res.data.getFollower) {
          this.setState({ follows: true });
        }
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
  handleFollow = async () => {
    await API.graphql(
      graphqlOperation(
        this.state.following ? mutations.removeFollower : mutations.addFollower,
        {
          username: this.props.state.user.username,
          follows: this.state.userInfo.username,
        }
      )
    ).then((res) => {
      this.setState({ following: !this.state.following });
    });
  };
  saveInfo = async (userInfo) => {
    console.log(userInfo);
    API.graphql(
      graphqlOperation(mutations.editUser, {
        input: {
          fullName: userInfo.name,
          description: userInfo.desc,
          height: userInfo.height,
          weight: userInfo.weight,
          username: this.state.userInfo.username,
        },
      })
    ).then((res) => {
      console.log(res);
      this.setState({
        userInfo: {
          ...this.state.userInfo,
          fullName: userInfo.name,
          description: userInfo.desc,
          height: userInfo.height,
          weight: userInfo.weight,
        },
      });
    });
  };
  render() {
    console.log(this.state.userInfo);
    return (
      <div className={css(styles.container)}>
        {this.state.followersModal && (
          <Followers
            followerProps={this.state.followerProps}
            closeModal={() => this.setState({ followersModal: false })}
            username={this.props.state.user.username}
            set_follows={(ammountFollows) => {
              console.log(ammountFollows);
              this.setState({
                userInfo: {
                  ...this.state.userInfo,
                  followers: ammountFollows,
                },
              });
            }}
            set_followers={(ammountFollowers) => {
              console.log(ammountFollowers);
              this.setState({
                userInfo: {
                  ...this.state.userInfo,
                  following: ammountFollowers,
                },
              });
            }}
          />
        )}
        {this.state.modal && (
          <Modal
            image={this.state.image}
            closeModal={() => {
              this.setState({ modal: false });
            }}
            saveInfo={(userInfo) => {
              this.setState({ modal: false });
              this.saveInfo(userInfo);
            }}
            userProfile={this.state.userInfo}
          />
        )}
        <div className={css(styles.presentation)}>
          <CoverPhoto
            changeProfile={(profileImg, fullName) =>
              this.props.changeProfile(profileImg, fullName)
            }
            user={this.state.user}
          />
        </div>
        <div className={css(styles.editableInfo)}>
          <div className={css(styles.bodyStats)}>
            <div className={css(styles.name)}>
              {this.state.userInfo.fullName}
            </div>
            <div className={css(styles.username)}>
              {`@${this.state.userInfo.username}`}
            </div>
            {this.isMobile() === true && (
              <div className={css(styles.followWrapper)}>
                {this.state.userProfile === true ? (
                  <Button
                    onClick={() => this.setState({ modal: true })}
                    className={css(styles.callToAction)}
                  >
                    Redigera kontot
                  </Button>
                ) : (
                  <Button
                    onClick={this.handleFollow}
                    className={css(
                      styles.callToAction,
                      this.state.following && styles.followsButton
                    )}
                  >
                    {this.state.following ? "Följer" : "Följ"}
                  </Button>
                )}
                {this.state.follows ? (
                  <div
                    className={css(styles.isFollowing)}
                  >{`@${this.state.userInfo.username} följer dig`}</div>
                ) : (
                  ""
                )}
                <div className={css(styles.followersWrapper)}>
                  <div
                    onClick={() =>
                      this.setState({
                        followersModal: true,
                        followerProps: {
                          followerVer: true,
                          userInfo: this.state.userInfo,
                        },
                      })
                    }
                    className={css(styles.followers)}
                  >
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.followers}
                    </div>
                    {` följare`}
                  </div>
                  <div
                    onClick={() =>
                      this.setState({
                        followersModal: true,
                        followerProps: {
                          followerVer: false,
                          userInfo: this.state.userInfo,
                        },
                      })
                    }
                    className={css(styles.followers)}
                  >
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.following}
                    </div>
                    {` följer`}
                  </div>
                </div>
              </div>
            )}
            <div className={css(styles.heightWeightWrapper)}>
              <div className={css(styles.heightWeight)}>
                {this.state.userInfo.height === null
                  ? "- cm"
                  : `${this.state.userInfo.height}cm`}
              </div>
              <div className={css(styles.heightWeight)}>
                {this.state.userInfo.height === null
                  ? "- kg"
                  : `${this.state.userInfo.weight}kg`}
              </div>
            </div>
            {this.state.userInfo.team === false ? (
              <div className={css(styles.teamError)}>
                Är inte registrerat med ett lag.
              </div>
            ) : (
              <div className={css(styles.heightWeight)}></div>
            )}
          </div>
          <div className={css(styles.description)}>
            {this.isMobile() === false && (
              <div className={css(styles.followWrapper)}>
                {this.state.userProfile === true ? (
                  <Button
                    onClick={() => this.setState({ modal: true })}
                    className={css(styles.callToAction)}
                  >
                    Redigera kontot
                  </Button>
                ) : (
                  <Button
                    onClick={this.handleFollow}
                    className={css(
                      styles.callToAction,
                      this.state.following && styles.followsButton
                    )}
                  >
                    {this.state.following ? "Följer" : "Följ"}
                  </Button>
                )}
                <div className={css(styles.followersWrapper)}>
                  <div
                    onClick={() =>
                      this.setState({
                        followersModal: true,
                        followerProps: {
                          followerVer: true,
                          userInfo: this.state.userInfo,
                        },
                      })
                    }
                    className={css(styles.followers)}
                  >
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.followers}
                    </div>
                    {` följare`}
                  </div>
                  <div
                    onClick={() =>
                      this.setState({
                        followersModal: true,
                        followerProps: {
                          followerVer: false,
                          userInfo: this.state.userInfo,
                        },
                      })
                    }
                    className={css(styles.followers)}
                  >
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.following}
                    </div>
                    {` följer`}
                  </div>
                </div>
              </div>
            )}
            {this.state.follows ? (
              <div
                className={css(styles.isFollowing)}
              >{`@${this.state.userInfo.username} följer dig`}</div>
            ) : (
              ""
            )}
            <div
              className={css(
                styles.userDesc,
                this.state.userInfo.description === null ||
                  /^\s*$/.test(this.state.userInfo.description)
                  ? styles.emptyDesc
                  : ""
              )}
            >
              {this.state.userInfo.description === null ||
              /^\s*$/.test(this.state.userInfo.description)
                ? "Profilen har ingen beskrivning"
                : this.state.userInfo.description}
            </div>
            <div className={css(styles.stats)}>
              <h3 className={css(styles.statsHeader)}>Säsongens Stats</h3>
              <div className={css(styles.statsWrapper)}>
                <div className={css(styles.bestStats)}>
                  <div className={css(styles.statDesc)}>Points</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                </div>
                <div className={css(styles.bestStats)}>
                  <div className={css(styles.statDesc)}>Assists</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                </div>
                <div className={css(styles.bestStats)}>
                  <div className={css(styles.statDesc)}>Rebounds</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                </div>
                <div className={css(styles.bestStats)}>
                  <div className={css(styles.statDesc)}>Blocks</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css(styles.menuesWrapper)}>
          <div className={css(styles.menuNav)}>
            <div
              onClick={() =>
                this.props.history.push(
                  `/home/users/${this.props.match.params.user}/`
                )
              }
              className={css(
                styles.menuItem,
                this.props.match.params.tab === undefined && styles.active
              )}
            >
              Stats
            </div>
            <div
              onClick={() =>
                this.props.history.push(
                  `/home/users/${this.props.match.params.user}/games`
                )
              }
              className={css(
                styles.menuItem,
                this.props.match.params.tab === "games" && styles.active
              )}
            >
              Matcher
            </div>
            <div
              onClick={() =>
                this.props.history.push(
                  `/home/users/${this.props.match.params.user}/posts`
                )
              }
              className={css(
                styles.menuItem,
                this.props.match.params.tab === "posts" && styles.active
              )}
            >
              Posts
            </div>
          </div>
          <div className={css(styles.menuResults)}>
            {this.props.match.params.tab === undefined && (
              <Stats username={this.state.userInfo.username} />
            )}
            {this.props.match.params.tab === "games" && (
              <Games username={this.state.userInfo.username} />
            )}
            {this.props.match.params.tab === "posts" && (
              <Posts username={this.props.match.params.user} />
            )}
          </div>
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
    set_follower: (followerAmmount) =>
      dispatch({ type: "SET_FOLLOWER", followerAmmount: followerAmmount }),
    set_follows: (followsAmmount) =>
      dispatch({ type: "SET_FOLLOWS", followsAmmount: followsAmmount }),
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
