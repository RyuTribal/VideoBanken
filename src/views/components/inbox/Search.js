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
import { API, graphqlOperation } from "aws-amplify";

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
    bottom: "11%",
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
});

class Search extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount = async () => {};

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
      console.log(res);
    });
  };
  render() {
    console.log(this.props.state.selectedRoom);
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.headerContainer)}>
          {this.isMobile() && (
            <button
              onClick={this.props.back}
              className={css(styles.headerLeftButton)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <h3 className={css(styles.header)}>Inställningar</h3>
        </div>
        {this.props.state.selectedRoom && (
          <div className={css(styles.contentWrapper)}>
            <div className={css(styles.imgWrapper)}>
              <img
                src={
                  this.props.state.selectedRoom.users.length < 2
                    ? blankProfile
                    : blankProfile
                }
                className={css(styles.profileImg)}
              ></img>
              <div className={css(styles.changeImage)}>
                <i className="fas fa-camera"></i>
              </div>
            </div>
            <div className={css(styles.settingsButtonsWrapper)}>
              <div className={css(styles.settingsButton)}>
                Redigera chattens namn
              </div>
              <div
                onClick={this.leaveChat}
                className={css(styles.leaveConvo, styles.settingsButton)}
              >
                Lämna chatten
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
