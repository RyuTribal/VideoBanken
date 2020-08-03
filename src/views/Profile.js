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
});

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      userInfo: {},
      userExists: true,
      userProfile: false,
      modal: false,
    };
  }
  componentDidMount = async () => {
    this.setState({
      user: this.props.match.params.user,
    });
    const currentUser = await Auth.currentAuthenticatedUser();
    if (currentUser.username === this.state.user) {
      this.setState({ userProfile: true });
    }
    this.props.onChange(`@${this.state.user}`);
    await API.graphql(
      graphqlOperation(queries.getUser, {
        username: this.state.user,
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
  };
  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.match.params.user !== this.props.match.params.user) {
      this.componentDidMount();
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
        {this.state.modal && (
          <Modal
            image={this.state.image}
            closeModal={() => {
              this.setState({ modal: false });
            }}
            upload={(userInfo) => {
              this.setState({ modal: false });
              // this.handleImageUpload(this.dataURItoBlob(image));
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
                  <Button className={css(styles.callToAction)}>Följ</Button>
                )}
                <div className={css(styles.followersWrapper)}>
                  <div className={css(styles.followers)}>
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.followers}
                    </div>
                    {` följare`}
                  </div>
                  <div className={css(styles.followers)}>
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
                  <Button className={css(styles.callToAction)}>Följ</Button>
                )}
                <div className={css(styles.followersWrapper)}>
                  <div className={css(styles.followers)}>
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.followers}
                    </div>
                    {` följare`}
                  </div>
                  <div className={css(styles.followers)}>
                    <div className={css(styles.ammountFollowers)}>
                      {this.state.userInfo.following}
                    </div>
                    {` följer`}
                  </div>
                </div>
              </div>
            )}
            <div
              className={css(
                styles.userDesc,
                this.state.userInfo.description === null && styles.emptyDesc
              )}
            >
              {this.state.userInfo.description === null
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

export default withRouter(Profile);
