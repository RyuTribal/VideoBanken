import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import $ from "jquery";
import VideoUpload from "./VideoUpload";
import HomeFeed from "./HomeFeed";
import Watch from "./Watch";
import { isMobile } from "react-device-detect";
let that;
class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount = async () => {};

  redirectToVideo = () => {
    this.props.history.push(`${this.props.match.path}/video-upload`);
  };
  componentWillUnmount() {
    $("html").unbind();
  }
  logout = () => {
    Auth.signOut()
      .then((data) => this.props.history.push("/login"))
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <BrowserRouter>
        <div>
          <main id="main-content" className="content-container">
            <nav className="navigation-container">
              {isMobile === false && (
                <div className="search-wrapper">
                  <input className="search-bar" placeholder="Sök..."></input>
                  <button
                    onClick={() => this.logout()}
                    className="confirm-search"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              )}
              <div className="lingering-links">
                <Link
                  className="add-video"
                  to={`${this.props.match.path}/video-upload`}
                >
                  <i className="fas fa-video"></i>
                </Link>
                {isMobile === true && (
                  <Link className="search-video" to={``}>
                    <i className="fas fa-search"></i>
                  </Link>
                )}
              </div>
            </nav>
            <div className="progress-bar">
              <div className="loader">
                <p></p>
              </div>
            </div>
            <div className="inner-content">
              <Route
                render={(props) => {
                  return (
                    <Switch>
                      <Route
                        exact
                        path={this.props.match.path}
                        component={HomeFeed}
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
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default Home;
