import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import Player from "../vanilla-player/Player";
import TagsInput from "react-tagsinput";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonBase,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Close, CancelRounded } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import theme from "../../../theme";
const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#F7F8FC",
    "z-index": "90001",
    "@media (max-width: 601px)": {
      height: "100%",
      width: "100%",
    },
  },
  overlay: {
    position: "fixed",
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.7)",
    "z-index": "90000",
  },
  modalContent: {
    height: 650,
    width: 600,
    "@media (max-width: 601px)": {
      height: "100%",
      width: "100%",
    },
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    "@media (max-width: 601px)": {
      fontSize: 13,
    },
    "@media (max-width: 376px)": {
      fontSize: 11,
    },
  },
  header: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    background: "#ea3a3a",
    padding: "10px 20px",
    fontSize: "1.5em",
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
  closeModal: {
    flex: 1,
    cursor: "pointer",
  },
  searchBar: {
    width: "100%",
    height: 48,
    display: "flex",
    flexDirection: "row",
    background: "white",
    borderBottom: "1px solid transparent",
    borderTop: "1px solid transparent",
    ":focus": {
      borderBottom: "1px solid rgb(38, 48, 64)",
      borderTop: "1px solid rgb(38, 48, 64)",
    },
  },
  searchIcon: {
    height: "100%",
    width: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  searchField: {
    width: "100%",
    height: "100%",
    ":focus": {
      outline: "none",
    },
    border: "none",
    padding: "16",
    background: "transparent",
  },
  userCount: {
    width: "100%",
    background: "white",
  },
  userResult: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  fetchedUser: {
    width: "100%",
  },
  messageBox: {
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    cursor: "pointer",
    transition: "0.2s",
    paddingLeft: 20,
    ":hover": {
      background: "white",
      transition: "0.2s",
    },
    position: "relative",
  },
  image: {
    width: 50,
    height: "100%",
    borderRadius: "50%",
  },
  nameMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  user: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "normal",
  },
  check: {
    position: "absolute",
    right: 20,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ea3a3a",
  },
  userContainer: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(38, 48, 64)",
    border: "1px solid rgb(38, 48, 64)",
    borderRadius: 30,
    color: "#fbf9f9",
    cursor: "pointer",
    transition: "0.2s",
    marginLeft: "1.5rem",
    marginBottom: "1.5rem",
    ":hover": {
      background: "transparent",
      transition: "0.2s",
      color: "rgb(38, 48, 64)",
    },
  },
  arrayImage: {
    width: 30,
    height: "100%",
    borderRadius: "50%",
  },

  arrayName: {
    marginLeft: "1.5rem",
  },
  removeUser: {
    marginRight: 10,
    marginLeft: 10,
  },
});
const useStyles = (theme) => ({
  input: {
    width: "100%",
  },
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialog: {
    minHeight: 650,
    background: "rgb(247, 248, 252)",
    padding: 0,
  },
  button: {
    width: "100%",
  },
});
class ChatModal extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      searchedUsers: [],
      userSearch: "",
      loading: false,
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}

  isMobile = () => {
    if (window.matchMedia("(max-width: 1281px)").matches) {
      return true;
    } else {
      return false;
    }
  };
  fetchUsers = async (e) => {
    this.setState({
      searchedUsers: [],
      userSearch: e.target.value,
    });
    if (!e.target.value || /^\s*$/.test(e.target.value)) {
    } else {
      await API.graphql(
        graphqlOperation(queries.searchUsers, {
          query: e.target.value,
        })
      ).then((res) => {
        if (!this.state.userSearch || /^\s*$/.test(this.state.userSearch)) {
          this.setState({
            searchedUsers: [],
          });
        } else {
          this.setState({
            searchedUsers: res.data.searchUsers,
          });
        }
      });
    }
  };
  createRoom = async () => {
    this.setState({ loading: true });
    let userArray = [];
    for (let i = 0; i < this.state.users.length; i++) {
      userArray.push(this.state.users[i].username);
    }
    const currentUser = await Auth.currentAuthenticatedUser();
    userArray.push(currentUser.username);
    userArray = [...new Set(userArray)];
    await API.graphql(
      graphqlOperation(mutations.createRoom, {
        users: JSON.stringify(userArray),
      })
    ).then((res) => {
      console.log(res);
      try {
        this.props.closeModal(true, JSON.parse(res.data.createRoom.id));
      } catch {
        this.props.closeModal(false);
      }
    });
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
    let isDisabled = true;
    if (this.state.users.length > 0) {
      isDisabled = false;
    }
    const { classes } = this.props;
    return (
      <Dialog
        open={true}
        fullWidth={true}
        //   maxWidth={true}
        onClose={() => this.props.closeModal()}
        aria-labelledby="form-dialog-title"
        fullScreen={this.isMobile()}
      >
        {this.isMobile() ? (
          <AppBar className={classes.appbar} id="form-dialog-title">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.props.closeModal}
              >
                <Close />
              </IconButton>
              <Typography className={classes.title} variant="h6">
                Redigera profil
              </Typography>
              <Button
                color="inherit"
                onClick={this.createRoom}
                disabled={this.state.loading || isDisabled}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Skapa"
                )}
              </Button>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle>Nytt Meddelande</DialogTitle>
        )}

        <DialogContent className={classes.dialog}>
          <div className={css(styles.searchBar)}>
            <div className={css(styles.searchIcon)}>
              <i className="fas fa-search"></i>
            </div>
            <input
              className={css(styles.searchField)}
              type="text"
              autoFocus
              placeholder="Sök användare..."
              onChange={this.fetchUsers}
              value={this.state.userSearch}
            />
          </div>
          <div className={css(styles.userCount)}>
            {this.state.users.map((user, i) => (
              <ButtonBase
                onClick={() =>
                  this.setState((prevState) => ({
                    users: prevState.users.filter((i) => i !== user),
                  }))
                }
              >
                <div className={css(styles.userContainer)}>
                  <div className={css(styles.arrayImageContainer)}>
                    <Avatar
                      src={user.profileImg}
                      className={css(styles.arrayImage)}
                    ></Avatar>
                  </div>
                  <div className={css(styles.arrayName)}>{user.fullName}</div>
                  <CancelRounded />
                </div>
              </ButtonBase>
            ))}
          </div>
          <div className={css(styles.userResult)}>
            {this.state.searchedUsers.map((user, i) => (
              <MessageBox
                key={i}
                user={user}
                addUser={(img) => {
                  user.profileImg = img;
                  this.setState((prevState) => ({
                    users: [...prevState.users, user],
                  }));
                }}
                removeUser={() =>
                  this.setState((prevState) => ({
                    users: prevState.users.filter((i) => i !== user),
                  }))
                }
                users={this.state.users}
                classes={classes}
              />
            ))}
          </div>
        </DialogContent>
        {!this.isMobile() && (
          <DialogActions>
            <Button
              color="inherit"
              onClick={() => {
                this.props.closeModal();
              }}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Avbryt"
              )}
            </Button>
            <Button
              color="inherit"
              onClick={this.createRoom}
              disabled={this.state.loading || isDisabled}
            >
              {this.state.loading === true ? (
                <i class="fas fa-sync fa-spin"></i>
              ) : (
                "Skapa"
              )}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}

class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      isPicked: false,
      img: null,
    };
  }
  componentDidMount = async () => {
    let image = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${this.props.user.username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });

    this.setState({ img: image });
  };
  componentDidUpdate = (prevProps) => {
    if (
      prevProps.users !== this.props.users &&
      !this.props.users.includes(this.props.user)
    ) {
      this.setState({ isPicked: false });
    }
  };
  render() {
    return (
      <ButtonBase
        className={this.props.classes.button}
        onClick={() => {
          if (this.state.isPicked) {
            this.setState({ isPicked: false });
            this.props.removeUser();
          } else {
            this.setState({ isPicked: true });
            this.props.addUser(this.state.img);
          }
        }}
      >
        <div
          className={css(styles.messageBox)}
        >
          {this.state.img ? (
            <Avatar src={this.state.img} className={css(styles.image)}></Avatar>
          ) : (
            <Skeleton variant="circle" width={50} height={50} />
          )}

          <div className={css(styles.nameMessageWrapper)}>
            <div className={css(styles.name)}>
              {this.props.user.fullName}{" "}
              <span
                className={css(styles.user)}
              >{`@${this.props.user.username}`}</span>
            </div>
          </div>
          {this.state.isPicked && (
            <div className={css(styles.check)}>
              <i className="fas fa-check"></i>
            </div>
          )}
        </div>
      </ButtonBase>
    );
  }
}

export default withStyles(useStyles)(ChatModal);
