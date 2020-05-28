import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { StyleSheet, css } from "aphrodite";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  headerContainer: {
    borderTop: "1px solid rgb(191, 156, 150)",
    borderBottom: "1px solid rgb(191, 156, 150)",
    minHeight: "58.08px",
  },
});

class Search extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount = async () => {};

  componentWillUnmount() {}

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.headerContainer)}></div>
      </div>
    );
  }
}

export default Search;
