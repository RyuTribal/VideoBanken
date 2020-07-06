import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import Messages from "./components/inbox/Messages";
import Chat from "./components/inbox/Chat";
import Search from "./components/inbox/Search";
import { StyleSheet, css } from "aphrodite";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { connect } from "react-redux";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  viewContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
});

class Inbox extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      modal: false,
      chosenWindow: "messages",
      profileImg: "",
      fullName: "",
    };
  }
  componentDidMount = async () => {
    this.props.onChange("Inbox");
    if (this.props.match.params.id) {
      this.props.change_room(JSON.parse(this.props.match.params.id));
    }
    const currentUser = await Auth.currentAuthenticatedUser();
    this.setState({ username: currentUser.username });
  };
  componentDidUpdate = (prevProps) => {
    if (
      prevProps.match.params.id !== this.props.match.params.id ||
      prevProps.state.rooms.length !== this.props.state.rooms.length
    ) {
      if (
        this.props.match.params.id &&
        this.props.match.params.id !== prevProps.match.params.id
      ) {
        this.props.change_room(JSON.parse(this.props.match.params.id));
      } else if (this.props.match.params.id) {
        this.props.change_room(JSON.parse(this.props.match.params.id));
      }
    }
  };
  componentWillUnmount() {
    this.props.clear_selected_room();
  }
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
    console.log(this.props.match.params);
    return (
      <div className={css(styles.container)}>
        {!this.isMobile() ? (
          <div className={css(styles.viewContainer)}>
            <Messages modal={this.props.modal} isMobile={this.props.isMobile} />
            <Chat isMobile={this.props.isMobile} modal={this.props.modal} />
            <Search
              isMobile={this.props.isMobile}
              getRooms={this.props.getRooms}
              redirectToProfile={(username) => {
                this.props.history.push("/home/users/" + username);
              }}
            />
          </div>
        ) : (
          <div className={css(styles.viewContainer)}>
            {!this.props.match.params.id &&
              !this.props.match.params.settings && (
                <Messages modal={this.props.modal} />
              )}
            {this.props.match.params.id && !this.props.match.params.settings && (
              <Chat
                id={this.props.match.params.id}
                back={() => {
                  this.props.history.push("/home/inbox/");
                  this.props.clear_selected_room();
                }}
                settingsOpen={() => {
                  this.props.history.push(
                    `/home/inbox/${this.props.state.selectedRoom.roomId}/settings`
                  );
                }}
              />
            )}
            {this.props.match.params.settings === "settings" &&
              this.props.state.selectedRoom && (
                <Search
                  back={() => {
                    this.props.history.push(
                      `/home/inbox/${this.props.state.selectedRoom.roomId}/`
                    );
                  }}
                  removeChat={() => {
                    this.props.history.push(`/home/inbox/`);
                  }}
                  getRooms={this.props.getRooms}
                  redirectToProfile={(username) => {
                    this.props.history.push("/home/users/" + username);
                  }}
                />
              )}
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
    add_message: (message) =>
      dispatch({ type: "ADD_MESSAGE", message: message }),
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
    clear_selected_room: () => dispatch({ type: "CLEAR_SELECTED_ROOM" }),
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Inbox));
