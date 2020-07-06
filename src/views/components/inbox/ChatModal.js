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
import blankProfile from "../../../img/blank-profile.png";
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
      this.props.closeModal(true, JSON.parse(res.data.createRoom.id));
    });
  };
  render() {
    let isDisabled = true;
    if (this.state.users.length > 0) {
      isDisabled = false;
    }
    return (
      <div className={css(styles.overlay)}>
        <div className={css(styles.modal)}>
          <div className={css(styles.modalContent)}>
            <div className={css(styles.modalHeader)}>
              <h2
                onClick={() => this.props.closeModal(false)}
                className={css(styles.closeModal)}
              >
                <i className="fas fa-times"></i>
              </h2>
              <h2 className={css(styles.header)}>Nytt meddelande</h2>
              <div className={css(styles.buttonContainer)}>
                <button
                  onClick={this.createRoom}
                  className={css(styles.submitButton)}
                  disabled={isDisabled || this.state.loading}
                >
                  {this.state.loading === true ? (
                    <i class="fas fa-sync fa-spin"></i>
                  ) : (
                    "Skapa"
                  )}
                </button>
              </div>
            </div>
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
                <div
                  onClick={() =>
                    this.setState((prevState) => ({
                      users: prevState.users.filter((i) => i !== user),
                    }))
                  }
                  className={css(styles.userContainer)}
                >
                  <div className={css(styles.arrayImageContainer)}>
                    {user.profileImg === null ? (
                      <img
                        className={css(styles.arrayImage)}
                        src={blankProfile}
                      ></img>
                    ) : (
                      <img
                        className={css(styles.arrayImage)}
                        src={user.profileImg}
                      ></img>
                    )}
                  </div>
                  <div className={css(styles.arrayName)}>{user.fullName}</div>
                  <div className={css(styles.removeUser)}>
                    <i className="fas fa-times"></i>
                  </div>
                </div>
              ))}
            </div>
            <div className={css(styles.userResult)}>
              {this.state.searchedUsers.map((user, i) => (
                <MessageBox
                  key={i}
                  user={user}
                  addUser={() =>
                    this.setState((prevState) => ({
                      users: [...prevState.users, user],
                    }))
                  }
                  removeUser={() =>
                    this.setState((prevState) => ({
                      users: prevState.users.filter((i) => i !== user),
                    }))
                  }
                  users={this.state.users}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class MessageBox extends Component {
  constructor() {
    super();
    this.state = {
      isPicked: false,
    };
  }
  componentWillReceiveProps(props) {
    if (!props.users.includes(props.user)) {
      this.setState({ isPicked: false });
    }
  }
  render() {
    return (
      <div
        onClick={() => {
          if (this.state.isPicked) {
            this.setState({ isPicked: false });
            this.props.removeUser();
          } else {
            this.setState({ isPicked: true });
            this.props.addUser();
          }
        }}
        className={css(styles.messageBox)}
      >
        {this.props.user.profileImg === null ? (
          <img className={css(styles.image)} src={blankProfile}></img>
        ) : (
          <img
            className={css(styles.image)}
            src={this.props.user.profileImg}
          ></img>
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
    );
  }
}

export default ChatModal;
