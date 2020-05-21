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
import { StyleSheet, css } from "aphrodite";
import { Auth, API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

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
  },
  bodyStats: {
    flex: "2",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  name: {
    paddingTop: 20,
    fontSize: 20,
  },
  username: {
    color: "#666666",
  },
  heightWeight: {
    color: "#666666",
    fontSize: 16,
    marginTop: "2%",
  },
  description: {
    flex: "5",
  },
  teamError: {
    color: "#666666",
    fontSize: 16,
    marginTop: "10%",
    fontStyle: "italic",
  },
  followWrapper: {
    display: "flex",
    alignItems: "center",
  },
  callToAction: {
    background: "#ea3a3a",
    padding: "10px 20px",
    boxSizing: "border-box",
    minWidth: 150,
    fontSize: 20,
    border: 0,
    transition: "0.4s",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
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
  },
  followers: {
    marginLeft: 20,
    fontSize: 18,
    color: "#666666",
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
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
  },
  statDesc: {
    fontSize: 15,
    color: "#666666",
  },
  statsAmmount: {
    fontSize: 22,
    fontWeight: "700",
  },
  menuesWrapper: {
    width: "100%",
  },

  menuNav: {
    display: "flex",
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
      activeMenu: "stats",
    };
  }
  componentDidMount = async () => {
    this.setState({ user: this.props.match.params.user });
    const currentUser = await Auth.currentAuthenticatedUser();
    if (currentUser.username === this.state.user) {
      this.props.onChange("Profil");
      this.setState({ userProfile: true });
    } else {
      this.props.onChange("None");
    }
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
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.presentation)}>
          <CoverPhoto user={this.state.user} />
        </div>
        <div className={css(styles.editableInfo)}>
          <div className={css(styles.bodyStats)}>
            <div className={css(styles.name)}>
              {this.state.userInfo.fullName}
            </div>
            <div className={css(styles.username)}>
              {`@${this.state.userInfo.username}`}
            </div>
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
            {this.state.userInfo.team === false ? (
              <div className={css(styles.teamError)}>
                Är inte registrerat med ett lag.
              </div>
            ) : (
              <div className={css(styles.heightWeight)}></div>
            )}
          </div>
          <div className={css(styles.description)}>
            <div className={css(styles.followWrapper)}>
              {this.state.userProfile === true ? (
                <button className={css(styles.callToAction)}>
                  Redigera kontot
                </button>
              ) : (
                <button className={css(styles.callToAction)}>Följ</button>
              )}
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
              onClick={() => this.setState({ activeMenu: "stats" })}
              className={css(
                styles.menuItem,
                this.state.activeMenu === "stats" && styles.active
              )}
            >
              Stats
            </div>
            <div
              onClick={() => this.setState({ activeMenu: "games" })}
              className={css(
                styles.menuItem,
                this.state.activeMenu === "games" && styles.active
              )}
            >
              Matcher
            </div>
            <div
              onClick={() => this.setState({ activeMenu: "posts" })}
              className={css(
                styles.menuItem,
                this.state.activeMenu === "posts" && styles.active
              )}
            >
              Posts
            </div>
          </div>
          <div className={css(styles.menuResults)}>
            {this.state.activeMenu === "stats" && (
              <Stats username={this.state.userInfo.username} />
            )}
            {this.state.activeMenu === "games" && (
              <Games username={this.state.userInfo.username} />
            )}
            {this.state.activeMenu === "posts" && (
              <Posts username={this.state.userInfo.username} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
