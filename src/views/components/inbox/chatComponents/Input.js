import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyleSheet, css } from "aphrodite";
import { Auth, graphqlOperation, API, Analytics } from "aws-amplify";
import * as queries from "../../../../graphql/queries";
import * as mutations from "../../../../graphql/mutations";
import * as subscriptions from "../../../../graphql/subscriptions";
import TextareaAutosize from "react-textarea-autosize";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderTop: "1px solid rgb(230, 236, 240)",
  },
  inputWrapper: {
    padding: "13px 5px",
    display: "flex",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  signButtons: {
    background: "transparent",
    border: "none",
    height: "100%",
    fontSize: 20,
    color: "rgb(38, 48, 64)",
    ":hover": {
      opacity: 0.7,
    },
    ":disabled": {
      opacity: 0.5,
    },
  },
  textBox: {
    flex: 20,
    outline: "none",
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    width: "100%",
    backgroundColor: "rgb(230, 236, 240)",
    border: "1px solid transparent",
    resize: "none",
    cursor: "text",
    ":empty:before": {
      content: "attr(data-placeholder)",
    },
    ":empty:focus:before": {
      opacity: 0.5,
    },
    ":focus": {
      background: "transparent",
      borderColor: "rgb(38, 48, 64)",
    },
  },
  sendButtonWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  rotate: {
    "-webkit-transform": "rotate(55deg)",
    "-moz-transform": "rotate(55deg)",
    "-ms-transform": "rotate(55deg)",
    "-o-transform": "rotate(55deg)",
    transform: "rotate(55deg)",
    "pointer-events": "none",
  },
});
function validate(messageValue) {
  return {
    messageValue: messageValue.length === 0,
  };
}
class Input extends Component {
  constructor() {
    super();
    this.state = {
      messageValue: "",
    };
    this.textRef = React.createRef();
  }
  handleMessageChange = (e) => {
    console.log(e.target.value.length);
    this.setState({ messageValue: e.target.value });
  };
  render() {
    const errors = validate(this.state.messageValue);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.inputWrapper)}>
          <div className={css(styles.imageContainer)}>
            <button className={css(styles.signButtons)}>
              <i className="fas fa-image"></i>
            </button>
          </div>
          <TextareaAutosize
            ref={this.textRef}
            className={css(styles.textBox)}
            contentEditable
            spellcheck
            onChange={this.handleMessageChange}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.stopPropagation();
                e.preventDefault();
                this.props.onSend(this.state.messageValue);
                this.setState({ messageValue: "" });
                e.target.value = "";
              }
            }}
            placeholder="Skriv ett meddelande här..."
            maxlength="250"
            minRows="0"
            maxRows="7"
          >
            {this.state.messageValue}
          </TextareaAutosize>
          <div className={css(styles.sendButtonWrapper)}>
            <button
              onClick={() => {
                this.props.onSend(this.state.messageValue);
                this.setState({ messageValue: "" });
                this.textRef.current.value = "";
              }}
              disabled={isDisabled}
              className={css(styles.signButtons)}
            >
              <i className={`fas fa-paper-plane ${css(styles.rotate)}`}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Input;
