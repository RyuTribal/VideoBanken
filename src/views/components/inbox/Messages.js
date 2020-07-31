import React, { Component } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Storage } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as subscriptions from "../../../graphql/subscriptions";
import { connect } from "react-redux";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  ButtonBase,
  Avatar,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Add, Group } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import theme from "../../../theme";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    borderRight: "1px solid rgb(191, 156, 150)",
    "@media (max-width: 813px)": {
      borderRight: "none",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      borderRight: "none",
    },
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
  addChat: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    marginRight: "0px",
  },
  messageBox: {
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    position: "relative",
    textAlign: "start",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    flex: 1,
  },
  nameMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
    flex: 3,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "start",
  },
  user: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "normal",
  },
  message: {
    color: "#666666",
  },
  active: {
    position: "absolute",
    right: "calc(0px - 10px)",
    height: "calc(100% + 20px)",
    top: "calc(0px - 10px)",
    width: 3,
    background: "#ea3a3a",
  },
  isRead: {
    color: "black",
    fontWeight: "bold",
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
  addChat: {
    marginRight: 0,
    padding: 0,
  },
  header: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  divButton: {
    width: "100%",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
  },
});
class Messages extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      chats: [],
      newestMessages: [],
      loading: true,
    };
  }
  componentDidMount = () => {};
  changeChat = (chat) => {
    if (chat) {
      this.props.history.push("/home/inbox/" + chat.roomId);
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
    const { classes } = this.props;
    const dummyData = ["foo", "bar"];
    return (
      <div className={css(styles.container)}>
        <AppBar position="relative" className={classes.appbar}>
          <Toolbar className={classes.toolbar} style={{ width: "100%" }}>
            <Typography
              className={classes.header}
              color="inherit"
              edge="center"
              variant="h6"
            >
              Meddelanden
            </Typography>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => this.props.modal()}
              className={classes.addChat}
            >
              <Add />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={css(styles.messagesContainer)}>
          {this.props.state.rooms.length > 0
            ? this.props.state.rooms.map((chat, i) => (
                <ButtonBase
                  onClick={() => this.changeChat(chat)}
                  className={classes.divButton}
                >
                  <MessageBox
                    chosen={
                      this.props.state.selectedRoom &&
                      this.props.state.selectedRoom.roomId
                    }
                    chat={chat}
                    lastMessage={chat.lastMessage && chat.lastMessage}
                    sendMessages={this.props.sendMessage}
                    classes={classes}
                  />
                </ButtonBase>
              ))
            : dummyData.map((data, i) => (
                <div className={classes.divButton}>
                  <div className={css(styles.messageBox)}>
                    <Skeleton variant="circle" width={50} height={50} />
                    <div className={css(styles.nameMessageWrapper)}>
                      <Skeleton variant="text" width="90%" />
                      <Skeleton variant="text" width="30%" />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
      user: "",
      lastMessage: "",
      isRead: true,
      img: null,
    };
  }
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    this.setState({ user: currentUser.username });
    if (this.props.chosen && this.props.chosen === this.props.chat.roomId) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
    if (this.props.lastMessage) {
      API.graphql(
        graphqlOperation(queries.getUnreadMessage, {
          id: this.props.lastMessage.id,
          username: this.state.user,
        })
      ).then((res) => {
        if (
          res.data.getUnreadMessage &&
          res.data.getUnreadMessage.isRead === false
        ) {
          this.setState({ isRead: false });
        }
      });
    }
    this.getImg();
  };
  getImg = async () => {
    let image = "";
    if (
      this.props.chat.users.length < 2 &&
      (this.props.chat.chatImg === null ||
        this.props.chat.chatImg === "" ||
        this.props.chat.chatImg === "$ctx.args.chatImg")
    ) {
      image = await Storage.vault
        .get(`profilePhoto.jpg`, {
          bucket: "user-images-hermes",
          level: "public",
          customPrefix: {
            public: `${this.props.chat.users[0].username}/`,
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
            public: `${this.props.chat.id}/groupImg/`,
          },
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        })
        .then((res) => {
          return res;
        });
    }
    this.setState({ img: image });
  };
  componentDidUpdate = (prevProps) => {
    if (this.state.active === true && this.state.isRead === false) {
      this.setState({ isRead: true });
    }
    if (
      this.props.chat.lastMessage !== prevProps.chat.lastMessage ||
      this.props.chosen !== prevProps.chosen ||
      this.props.lastMessage !== prevProps.lastMessage
    ) {
      if (this.props.chosen === this.props.chat.roomId) {
        this.setState({ active: true });
      } else {
        this.setState({ active: false });
      }
      if (this.props.lastMessage) {
        API.graphql(
          graphqlOperation(queries.getUnreadMessage, {
            id: this.props.lastMessage.id,
            username: this.state.user,
          })
        ).then((res) => {
          if (
            res.data.getUnreadMessage &&
            res.data.getUnreadMessage.isRead === false
          ) {
            this.setState({ isRead: false });
          }
        });
      }
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
    const { classes } = this.props;
    return (
      <div className={css(styles.messageBox)}>
        {this.state.img ? (
          <Avatar
            className={this.props.classes.avatar}
            width={50}
            src={this.state.img}
          >
            <Group />
          </Avatar>
        ) : (
          <Skeleton variant="circle" width={50} height={50} />
        )}

        <div className={css(styles.nameMessageWrapper)}>
          <div className={css(styles.name)}>
            {this.props.chat.title}{" "}
            {this.props.chat.users.length < 2 &&
              this.props.chat.hasTitle === false && (
                <span className={css(styles.user)}>{`@${
                  this.props.chat.users && this.props.chat.users.length > 0
                    ? this.props.chat.users[0].username
                    : this.state.user
                }`}</span>
              )}
          </div>
          <div
            className={css(
              styles.message,
              this.state.isRead === false && styles.isRead
            )}
          >
            {!this.props.chat.lastMessage ||
            this.props.chat.lastMessage.text === ""
              ? "..."
              : this.props.chat.lastMessage.text}
          </div>
          {this.state.active && !this.isMobile() && (
            <div className={css(styles.active)}></div>
          )}
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
    add_message: (message) =>
      dispatch({ type: "ADD_MESSAGE", message: message }),
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
  };
}
export default withStyles(useStyles)(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Messages))
);
