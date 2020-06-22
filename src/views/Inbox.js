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
      chosenRoom: "",
      modal: false,
      chats: [],
      currentUsers: [],
      roomTitle: "",
      chosenWindow: "messages",
      profileImg: "",
      fullName: "",
    };
  }
  componentDidMount = async () => {
    this.props.onChange("Inbox");
    const currentUser = await Auth.currentAuthenticatedUser();
    this.setState({ username: currentUser.username });
    this.getRooms();
  };
  componentWillReceiveProps = (props) => {
    if (props.newChat === true) {
      this.getRooms();
    }
  };
  componentWillUnmount() {}
  getRooms = async () => {
    let rooms = await API.graphql(
      graphqlOperation(queries.getRooms, {
        username: this.state.username,
      })
    ).then((res) => {
      return res.data.getRooms;
    });
    if (rooms.length > 0) {
      console.log(rooms);
      console.log(rooms[0].users);
      const currentUserInfo = JSON.parse(rooms[0].users).filter(
        (i) => i.username === this.state.username
      );
      this.setState({
        profileImg: currentUserInfo[0].profileImg,
        fullName: currentUserInfo[0].fullName,
      });
      rooms = rooms.map((room) => {
        room.users = JSON.parse(room.users).filter(
          (i) => i.username !== this.state.username
        );
        if (room.users.length === 1) {
          room.title = room.users[0].fullName;
        } else if (room.users.length > 1) {
          let nameArray = [];
          room.users.map((user) => {
            nameArray.push(user.fullName.split(" ")[0]);
          });
          room.title =
            nameArray.join(", ").length > 50
              ? nameArray.join(", ").substr(0, 50 - 1) + "..."
              : nameArray.join(", ");
        } else if (room.users.length < 1) {
          room.title = "Jag";
        }
        return room;
      });
      if (rooms.length > 0) {
        this.setState({
          chats: rooms,
          currentUsers: rooms[0].users,
          roomTitle: rooms[0].title,
        });
      }
      console.log(this.state.chosenRoom);
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
    console.log(this.state.chosenWindow);
    return (
      <div className={css(styles.container)}>
        {!this.isMobile() ? (
          <div className={css(styles.viewContainer)}>
            <Messages
              chats={this.state.chats}
              changeChat={(chat) => {
                this.setState({
                  chosenRoom: chat.roomId,
                  currentUsers: chat.users,
                  roomTitle: chat.title,
                });
              }}
              chosenChat={this.state.chosenRoom}
              modal={this.props.modal}
              isMobile={this.props.isMobile}
              latestMessage={this.state.latestMessage}
              newestMessages={this.state.newestMessages}
            />
            <Chat
              id={this.state.chosenRoom}
              users={this.state.currentUsers}
              title={this.state.roomTitle}
              isMobile={this.props.isMobile}
              fullName={this.state.fullName}
              profileImg={this.state.profileImg}
              modal={this.props.modal}
            />
            {/* <Search isMobile={this.props.isMobile} /> */}
          </div>
        ) : (
          <div className={css(styles.viewContainer)}>
            {this.state.chosenWindow === "messages" && (
              <Messages
                chats={this.state.chats}
                changeChat={(chat) => {
                  this.setState({
                    chosenRoom: chat.roomId,
                    currentUsers: chat.users,
                    roomTitle: chat.title,
                    chosenWindow: "chat",
                  });
                }}
                chosenChat={this.state.chosenRoom}
                modal={this.props.modal}
              />
            )}
            {this.state.chosenWindow === "chat" && (
              <Chat
                id={this.state.chosenRoom}
                users={this.state.currentUsers}
                title={this.state.roomTitle}
                back={() => this.setState({ chosenWindow: "messages" })}
                fullName={this.state.fullName}
                profileImg={this.state.profileImg}
              />
            )}
            {this.state.chosenWindow === "settings" && <Search />}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Inbox);
