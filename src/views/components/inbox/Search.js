import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import blankProfile from "../../../img/blank-profile.png";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  ButtonBase,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ArrowBackIosRounded, SettingsRounded } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    borderLeft: "1px solid rgb(191, 156, 150)",
    "@media (max-width: 813px)": {
      borderLeft: "none",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      borderLeft: "none",
    },
    position: "relative",
  },
  headerContainer: {
    borderTop: "1px solid rgb(191, 156, 150)",
    borderBottom: "1px solid rgb(191, 156, 150)",
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  header: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  headerLeftButton: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    marginLeft: "0px",
  },
  contentWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    flexDirection: "column",
  },
  imgWrapper: {
    maxWidth: 191,
    maxHeight: 191,
    position: "relative",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  changeImage: {
    position: "absolute",
    background: "#fbf9f9",
    width: 35,
    height: 35,
    bottom: "5%",
    right: "0%",
    borderRadius: "50%",
    color: "#263040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
  },
  settingsButtonsWrapper: {
    width: "100%",
    paddingTop: 20,
  },
  settingsButton: {
    padding: 20,
    borderTop: "1px solid rgb(191, 156, 150)",
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },
  leaveConvo: {
    borderBottom: "1px solid rgb(191, 156, 150)",
    color: "#f44336",
  },
  chatUserWrapper: {
    borderTop: "1px solid rgb(191, 156, 150)",
    maxHeight: "100%",
    width: "100%",
    flexDirection: "column",
  },
  chatUser: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    cursor: "pointer",
  },
  userImg: {
    height: 50,
    width: 50,
    borderRadius: "50%",
  },
  userNames: {
    fontSize: 15,
    fontWeight: "bold",
    height: 50,
    display: "flex",
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "column",
  },
  userHandle: {
    fontSize: 12,
    color: "rgb(102, 102, 102)",
    fontWeight: "normal",
  },
  profilePop: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    bottom: 0,
    boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.5)",
    zIndex: 5,
    background: "rgb(247, 248, 252)",
  },
  optionBtn: {
    padding: 20,
    borderTop: "1px solid rgb(191, 156, 150)",
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  cursorAuto: {
    cursor: "auto",
  },
  changeName: {
    fontWeight: "normal",
    width: "100%",
    padding: "10px 20px",
    boxsizing: "border-box",
    fontSize: 15,
    background: "none",
    border: "0.5px solid #a18e78",
    borderRadius: 5,
    color: "#263040",
    backgroundColor: "rgb(245, 244, 242)",
    position: "relative",
    "::placeholder": {
      color: "#999999",
      transition: "0.3s",
    },
    ":hover": {
      border: "0.5px solid #263040",
      backgroundColor: "transparent",
      transition: "0.5s",
    },
    ":focus": {
      outline: "rgba(0, 0, 0, 0)",
      border: "0.5px solid #263040",
      backgroundColor: "transparent",
      transition: "0.5s",
      "::placeholder": {
        transition: "0.3s",
        color: "transparent",
      },
    },
  },
});
const useStyles = (theme) => ({
  appbar: {
    background: "transparent",
    color: "black",
    boxShadow: "none",
    borderBottom: "1px solid rgb(191, 156, 150)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "center",
  },
  backChat: {
    marginLeft: 0,
    padding: 0,
  },
  settings: {
    marginRight: 0,
    padding: 0,
  },
  header: {
    marginLeft: 0,
    marginRight: "auto",
  },
  headerMobile: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  svgButtons: {
    height: 15,
    width: 15,
  },
  groupImg: {
    height: 200,
    width: 200,
  },
  button: {
    width: "100%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
class Search extends Component {
  constructor() {
    super();
    this.state = {
      clickedUsername: "",
      isOpen: false,
      newName: "",
      img: null,
      profileImages: [],
    };
  }
  componentDidMount = async () => {};
  componentDidUpdate = async (prevProps) => {
    if (
      prevProps.state.selectedRoom !== this.props.state.selectedRoom &&
      this.props.state.selectedRoom
    ) {
      this.setState({ profileImages: [] });
      await this.getImg();
      console.log(this.props.state.selectedRoom.users);
      for (let i = 0; i < this.props.state.selectedRoom.users.length; i++) {
        await this.getUserImg(this.props.state.selectedRoom.users[i].username);
      }
    }
  };
  componentWillUnmount() {}
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
  leaveChat = () => {
    API.graphql(
      graphqlOperation(mutations.removeChatUser, {
        username: this.props.state.user.username,
        roomId: this.props.state.selectedRoom.roomId,
      })
    ).then((res) => {
      this.props.remove_room(res.data.removeChatUser.roomId);
      if (this.isMobile()) {
        this.props.removeChat();
      }
      this.setState({ isOpen: false });
      console.log(res);
    });
  };
  removeUser = async () => {
    API.graphql(
      graphqlOperation(mutations.removeChatUser, {
        username: this.state.clickedUsername,
        roomId: this.props.state.selectedRoom.roomId,
      })
    ).then((res) => {
      this.props.getRooms();
      this.setState({ isOpen: false });
      console.log(res);
    });
  };
  saveNewName = async () => {
    API.graphql(
      graphqlOperation(mutations.editChatRoom, {
        roomId: this.props.state.selectedRoom.roomId,
        title: this.state.newName,
        chatImg: null,
      })
    ).then((res) => {
      this.setState({ newName: "" });
      this.props.getRooms();
      if (this.isMobile()) {
        this.props.back();
      }
    });
  };
  getUserImg = async (username) => {
    const userImg = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    this.setState((prevState) => ({
      profileImages: [...prevState.profileImages, userImg],
    }));
  };
  getImg = async () => {
    let image = "";
    if (
      this.props.state.selectedRoom.users.length < 2 &&
      (this.props.state.selectedRoom.chatImg === null ||
        this.props.state.selectedRoom.chatImg === "" ||
        this.props.state.selectedRoom.chatImg === "$ctx.args.chatImg")
    ) {
      image = await Storage.vault
        .get(`profilePhoto.jpg`, {
          bucket: "user-images-hermes",
          level: "public",
          customPrefix: {
            public: `${this.props.state.selectedRoom.users[0].username}/`,
          },
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        })
        .then((res) => {
          return res;
        });
    } else {
      image = await Storage.vault
        .get(`groupPhoto.jpg`, {
          bucket: "group-images-hermes",
          level: "public",
          customPrefix: {
            public: `${this.props.state.selectedRoom.id}/groupImg/`,
          },
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        })
        .then((res) => {
          return res;
        });
    }
    const userImg = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${this.props.state.user.username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    this.setState({ img: image, userImg: userImg });
  };
  render() {
    console.log(this.state.profileImages);
    const { classes } = this.props;
    return (
      <div className={css(styles.container)}>
        {this.state.isOpen === true && (
          <div
            onClick={() => {
              this.setState({ isOpen: false });
            }}
            className={css(styles.overlay)}
          ></div>
        )}
        <AppBar position="relative" className={classes.appbar}>
          <Toolbar className={classes.toolbar} style={{ width: "100%" }}>
            {this.isMobile() && (
              <IconButton
                onClick={this.props.back}
                className={classes.backChat}
                color="inherit"
              >
                <ArrowBackIosRounded className={classes.svgButtons} />
              </IconButton>
            )}
            <Typography
              className={
                this.isMobile() ? classes.headerMobile : classes.header
              }
              color="inherit"
              edge="center"
              variant="h6"
            >
              Inställningar
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.state.selectedRoom && (
          <div className={css(styles.contentWrapper)}>
            <div className={css(styles.imgWrapper)}>
              <Avatar
                src={this.state.img}
                className={classes.groupImg}
              ></Avatar>
              <div className={css(styles.changeImage)}>
                <i className="fas fa-camera"></i>
              </div>
            </div>
            <div className={css(styles.settingsButtonsWrapper)}>
              <div className={css(styles.settingsButton, styles.cursorAuto)}>
                <input
                  className={css(styles.changeName)}
                  value={this.state.newName}
                  placeholder="Ändra gruppens namn..."
                  onChange={(e) => this.setState({ newName: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      this.saveNewName();
                    }
                  }}
                />
              </div>
              <div className={css(styles.chatUserWrapper)}>
                <ButtonBase
                  onClick={() => {
                    this.setState({
                      clickedUsername: this.props.state.user.username,
                      isOpen: true,
                    });
                  }}
                  className={classes.button}
                >
                  <Avatar
                    src={this.state.userImg}
                    className={css(styles.userImg)}
                  ></Avatar>
                  <div className={css(styles.userNames)}>Jag</div>
                </ButtonBase>
                {this.props.state.selectedRoom.users.map((user, i) => (
                  <ButtonBase
                    onClick={() => {
                      this.setState({
                        clickedUsername: user.username,
                        isOpen: true,
                      });
                    }}
                    className={classes.button}
                  >
                    <Avatar
                      src={this.state.profileImages[i]}
                      className={css(styles.userImg)}
                    ></Avatar>
                    <div className={css(styles.userNames)}>
                      {user.fullName}
                      <div
                        className={css(styles.userHandle)}
                      >{`@${user.username}`}</div>
                    </div>
                  </ButtonBase>
                ))}
              </div>
            </div>
          </div>
        )}
        {this.state.isOpen === true && (
          <div className={css(styles.profilePop)}>
            <div
              className={css(
                styles.optionBtn,
                styles.userHandle,
                styles.cursorAuto
              )}
            >
              {`@${this.state.clickedUsername}`}
            </div>
            <div
              onClick={() =>
                this.props.redirectToProfile(this.state.clickedUsername)
              }
              className={css(styles.optionBtn)}
            >
              Se Profil
            </div>
            <div
              onClick={
                this.state.clickedUsername === this.props.state.user.username
                  ? this.leaveChat
                  : this.removeUser
              }
              className={css(styles.optionBtn, styles.leaveConvo)}
            >
              {this.state.clickedUsername === this.props.state.user.username
                ? "Lämna gruppen"
                : "Ta bort från gruppen"}
            </div>
          </div>
        )}
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
      dispatch({
        type: "ADD_MESSAGE",
        message: message,
        settingLast: settingLast,
      }),
    set_messages: (messages) =>
      dispatch({ type: "SET_MESSAGES", messages: messages }),
    remove_notifications: (id) =>
      dispatch({ type: "REMOVE_NOTIFICATIONS", id: id }),
    clear_selected_room: () => dispatch({ type: "CLEAR_SELECTED_ROOM" }),
  };
}

export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(Search)
);
