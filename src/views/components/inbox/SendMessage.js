import React, { Component } from "react";

export default class extends Component {
  state = {
    body: "",
  };

  handleChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  async submit(e) {
    e.preventDefault();

    await this.props.onCreate({ body: this.state.body });

    this.message.value = "";
  }

  render() {
    return (
      <form onSubmit={(e) => this.submit(e)}>
        <input
          ref={(m) => {
            this.message = m;
          }}
          name="body"
          placeholder="body"
          onChange={(e) => this.handleChange("body", e)}
          className="message-input"
        />
      </form>
    );
  }
}
