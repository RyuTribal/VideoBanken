import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import CoverPhoto from "./components/team/CoverPhoto";
import Stats from "./components/profile/Stats";
import Games from "./components/profile/Games";
import Posts from "./components/profile/Posts";
import Roster from "./components/team/Roster";
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
    "@media (max-width: 813px)": {
      flexDirection: "column",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      flexDirection: "column",
    },
  },
  bodyStats: {
    flex: "2",
    position: "relative",
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
  currentSeason: {
    color: "#666666",
    fontSize: 14,
    marginTop: "auto",
  },
  seasonWinLose: {
    color: "#666666",
    fontSize: 20,
    marginBot: "auto",
    
  },
  clubLine: {
    color: "#666666",
    fontSize: 14,
    paddingTop: 10,
    marginTop: "auto",
  },
  club: {
    fontSize: 18,
    marginBot: "auto",
  },
  statsFloor: {
    height: 20,
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
    padding: "0 auto 0 auto",
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

    background: "#efefef",
    margin: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 120,
    flexDirection: "column",
    "@media (max-width: 376px)": {
      height: "auto",
      margin: 5,
    },
  },

  statHolderProfile: {
    paddingTop: "100%",
    width: "100%",
    maxWidth: 120,
    backgroundColor: "#666666",
    "@media (max-width: 376px)": {
      fontSize: 10,
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
  statsHolder: {
    fontSize: 12,
    color: "#666666",
    "@media (max-width: 376px)": {
      fontSize: 8,
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

class Team extends Component {
  constructor() {
    super();
    this.state = { activeMenu: "roster" }

  }
  componentDidMount = () => {

    this.props.onChange("Team");

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
        <div className={css(styles.presentation)}>
          <CoverPhoto/>
        </div>
        <div className={css(styles.editableInfo)}>
          <div className={css(styles.bodyStats)}>
            <div className={css(styles.name)}>
              Huddinge P06
            </div>
            <div className={css(styles.username)}>
              @HBBKRödP06
            </div>
            {this.isMobile() === true && (
              <div className={css(styles.followWrapper)}>
                {this.state.userProfile === true ? (
                  <button className={css(styles.callToAction)}>
                    Redigera lag
                  </button>
                ) : (
                    <button className={css(styles.callToAction)}>Följ</button>
                  )}
                <div className={css(styles.followersWrapper)}>
                  <div className={css(styles.followers)}>
                    <div className={css(styles.ammountFollowers)}>
                      25
                    </div>
                    {` följare`}
                  </div>

                </div>
              </div>
            )}

  
              <div className={css(styles.currentSeason)}>
                Season
              </div>
              <div className={css(styles.seasonWinLose)}>
                0W - 0L
              </div>
              <div className={css(styles.clubLine)}>
                Club
              </div>
              <div className={css(styles.club)}>
                Huddinge Basket
              </div>
              <div className={css(styles.statsFloor)}></div>
            
          </div>
          <div className={css(styles.description)}>
            {this.isMobile() === false && (
              <div className={css(styles.followWrapper)}>

                <button className={css(styles.callToAction)}>
                  Redigera laget
                  </button>

                <div className={css(styles.followersWrapper)}>
                  <div className={css(styles.followers)}>
                    <div className={css(styles.ammountFollowers)}>
                      25
                    </div>
                    {` följare`}
                  </div>

                </div>
              </div>
            )}
            <div className={css(styles.userDesc)}>
              Laget har ingen beskrivning.
            </div>
            <div className={css(styles.stats)}>
              <h3 className={css(styles.statsHeader)}>Poängledare</h3>
              <div className={css(styles.statsWrapper)}>
                <div className={css(styles.bestStats)}>
                  <div className={css(styles.statHolderProfile)}></div>
                    <div className={css(styles.statDesc)}>Points</div>
                    <div className={css(styles.statsAmmount)}>75.3</div>
                    <div className={css(styles.statsHolder)}>Ivan Sedelkin</div>
                </div>
                <div className={css(styles.bestStats)}>
                <div className={css(styles.statHolderProfile)}></div>
                  <div className={css(styles.statDesc)}>Assists</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                  <div className={css(styles.statsHolder)}>Ivan Sedelkin</div>
                </div>
                <div className={css(styles.bestStats)}>
                <div className={css(styles.statHolderProfile)}></div>
                  <div className={css(styles.statDesc)}>Rebounds</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                  <div className={css(styles.statsHolder)}>Ivan Sedelkin</div>
                </div>
                <div className={css(styles.bestStats)}>
                <div className={css(styles.statHolderProfile)}></div>
                  <div className={css(styles.statDesc)}>Blocks</div>
                  <div className={css(styles.statsAmmount)}>-</div>
                  <div className={css(styles.statsHolder)}>Ivan Sedelkin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css(styles.menuesWrapper)}>
          <div className={css(styles.menuNav)}>
            <div
              onClick={() => this.setState({ activeMenu: "roster" })}
              className={css(
                styles.menuItem,
                this.state.activeMenu === "roster" && styles.active
              )}
            >
              Roster
            </div>
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
            {this.state.activeMenu === "roster" && (
              // <Stats username={this.state.userInfo.username} />
              <div><Roster/></div>
            )}
            {this.state.activeMenu === "stats" && (
              // <Games username={this.state.userInfo.username} />
              <div>Stats</div>
            )}
            {this.state.activeMenu === "games" && (
              // <Games username={this.state.userInfo.username} />
              <div>Games</div>
            )}
            {this.state.activeMenu === "posts" && (
              // <Posts username={this.state.userInfo.username} />
              <div>Posts</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Team);
