import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import $ from "jquery";
import VideoUpload from "./VideoUpload";
import HomeFeed from "./HomeFeed";
import Watch from "./Watch";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import SidebarComponent from "./components/sidebar/SidebarComponent";
import HeaderComponent from "./components/header/HeaderComponent";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    minHeight: "100vh",
  },
  content: {
    marginTop: 54,
    overflowY: "auto",
    overflowX: "hidden",
    height: "100vh",
    zIndex: 5,
  },
  mainBlock: {
    backgroundColor: "#F7F8FC",
  },
  padded: {
    padding: 30,
    '@media (max-width: 768px)': {
      padding: 0
  }
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        username: "",
        attributes: {
          nickname: "",
        },
      },
      selectedItem: "Feed",
    };
  }
  state = { selectedItem: "Feed" };
  componentDidMount = async () => {
    window.addEventListener('resize', this.resize);
    await Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        this.setState({
          user: { username: user.username, attributes: user.attributes },
        });
        console.log(this.state.user);
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
  };

  resize = () => this.forceUpdate();

  redirectToVideo = () => {
    this.props.history.push(`${this.props.match.path}/video-upload`);
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  logout = () => {
    Auth.signOut()
      .then((data) => this.props.history.push("/login"))
      .catch((err) => console.log(err));
  };
  render() {
    const { selectedItem } = this.state;
    return (
      <BrowserRouter>
        <Row id="wrapper" className={css(styles.container)}>
          <SidebarComponent
            isMobile={isMobile}
            selectedItem={selectedItem}
            onChange={(selectedItem) => this.setState({ selectedItem })}
          />
          <Column flexGrow={1} className={css(styles.mainBlock)}>
            <HeaderComponent
              usernickname={this.state.user.attributes.nickname}
              title={selectedItem}
            />
            <div className={css(styles.content)}>
              <div className={css(styles.padded)}>
                <Route
                  render={(props) => {
                    return (
                      <Switch>
                        <Route
                          exact
                          path={this.props.match.path}
                          render={() => <HomeFeed user={this.state.user} />}
                        />
                        <Route
                          path={`${this.props.match.path}/video-upload`}
                          component={VideoUpload}
                        />
                        <Route
                          path={`${this.props.match.path}/watch`}
                          component={Watch}
                        />
                      </Switch>
                    );
                  }}
                />
              </div>
            </div>
          </Column>
        </Row>
      </BrowserRouter>
    );
  }
}

export default Home;
