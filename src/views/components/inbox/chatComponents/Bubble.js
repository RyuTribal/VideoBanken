import React, { Component } from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";
import blankProfile from "../../../../img/blank-profile.png";

const styles = StyleSheet.create({
  container: {},
  bubbleContainer: {
    padding: 10,
    display: "flex",
    width: "100%",
    flexDirection: "column-reverse",
  },
  profileContainer: {},
  yourContainer: {
    marginLeft: "auto",
    marginRight: 0,
  },
  dateWrapper: {
    textAlign: "center",
    color: "#AAAAAA",
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
  },
  bubble: {
    padding: 10,
    display: "inline-flex",
    flexDirection: "column",
    wordBreak: "break-word",
    borderRadius: 15,
    background: "rgb(240, 240, 240)",
    color: "black",
  },
  yourBubble: {
    textAlign: "end",
    background: "rgb(38, 48, 64)",
    color: "#fbf9f9",
  },
  profileImg: {
    height: 35,
    width: 35,
    borderRadius: "50%",
    border: "1px solid rgb(191, 156, 150)",
    cursor: "pointer",
    marginRight: "1.5rem",
    marginTop: 7.5,
  },
  timeWrapper: {
    fontSize: 11,
  },
  otherTime: {
    color: "#aaaaaa",
  },
});
class Bubble extends Component {
  constructor() {
    super();
    this.state = {
      message: {},
      username: "",
      prevMessage: {},
    };
  }
  componentDidMount = async () => {
    const { username } = await Auth.currentAuthenticatedUser();
    this.setState({
      message: this.props.message,
      username: username,
      prevMessage: this.props.prevMessage,
    });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.message !== this.props.message) {
      this.setState({
        message: this.props.message,
        prevMessage: this.props.prevMessage,
      });
    }
  };
  getTime = (date) => {
    if (date) {
      let messageDate = new Date(Date.parse(date.replace(" ", "T")));
      let pm = false;
      let hours = messageDate.getHours();
      if (hours > 12) {
        pm = true;
        hours = hours - 12;
      }
      let minutes = messageDate.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      messageDate = `${hours}:${minutes} ${pm ? "PM" : "AM"}`;
      return messageDate;
    }
  };
  getDate = (date) => {
    if (date) {
      let messageDate = new Date(Date.parse(date.replace(" ", "T")));
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OKT",
        "NOV",
        "DEC",
      ];
      const year = messageDate.getFullYear();
      const month = messageDate.getMonth();
      const day = messageDate.getDate();
      messageDate = `${months[month]} ${day}, ${year}`;
      return messageDate;
    }
  };
  compareDate = (date, prevMessage) => {
    if (date && prevMessage) {
      let messageDate = new Date(Date.parse(date.replace(" ", "T")));
      let prevMessageDate = new Date(
        Date.parse(prevMessage.createdAt.replace(" ", "T"))
      );
      if (
        messageDate.getFullYear() === prevMessageDate.getFullYear() &&
        messageDate.getMonth() === prevMessageDate.getMonth() &&
        messageDate.getDate() === prevMessageDate.getDate()
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.bubbleContainer)}>
          {!this.compareDate(
            this.state.message.createdAt,
            this.state.prevMessage
          ) ? (
            <div className={css(styles.dateWrapper)}>
              {this.getDate(this.state.message.createdAt)}
            </div>
          ) : (
            ""
          )}
          <div
            className={css(
              styles.profileContainer,
              this.state.message.user &&
                this.state.message.user.id === this.state.username
                ? styles.yourContainer
                : ""
            )}
          >
            {this.state.message.user &&
            this.state.message.user.id !== this.state.username ? (
              <img
                onClick={() => {
                  this.props.history.push(
                    `/home/users/${this.state.message.user.id}`
                  );
                }}
                className={css(styles.profileImg)}
                src={
                  JSON.parse(this.state.message.user.avatar)
                    ? this.state.message.user.avatar
                    : blankProfile
                }
              ></img>
            ) : (
              ""
            )}

            <div
              className={css(
                styles.bubble,
                this.state.message.user &&
                  this.state.message.user.id === this.state.username
                  ? styles.yourBubble
                  : ""
              )}
            >
              {this.state.message.text}
              <div
                className={css(
                  styles.timeWrapper,
                  this.state.message.user &&
                    this.state.message.user.id !== this.state.username
                    ? styles.otherTime
                    : ""
                )}
              >
                {`${
                  this.state.message.user &&
                  this.state.message.user.id !== this.state.username
                    ? `~ ${this.state.message.user.name}`
                    : ""
                } ${this.getTime(this.state.message.createdAt)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Bubble);
