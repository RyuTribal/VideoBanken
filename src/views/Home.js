import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import $ from "jquery";
import VideoUpload from "./VideoUpload";
import HomeFeed from "./HomeFeed";
var that;
class Home extends Component {
  componentDidMount(prevProps) {
    $("html").click(function() {
      closeNav();
    });

    $("#app-nav").click(function(event) {
      event.stopPropagation();
    });

    $(".closebtn").click(function() {
      closeNav();
    });
  }

  redirectToVideo() {
    that.props.history.push(`${that.props.match.path}/video-upload`);
  }

  componentWillUnmount(){
    
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <div id="app-nav" className="home-navigation">
            <a
              href="javascript:void(0)"
              className="closebtn"
              onClick={closeNav}
            >
              ×
            </a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Clients</a>
            <a href="#">Contact</a>
          </div>
          <main id="main-content" className="content-container">
            <nav className="navigation-container">
              <button className="openNav" onClick={openNav}>
                ☰
              </button>
              <Link
                className="add-video"
                to={`${this.props.match.path}/video-upload`}
              >
                <i className="fas fa-video"></i>
              </Link>
            </nav>
            <div id="inner-content" className="inner-content">
              <Route
                render={props=>{

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

function openNav() {
  if (!$("#app-nav").css("width", "0")) {
    closeNav();
  } else {
    document.getElementById("app-nav").style.width = "280px";
    $("#main-content").css("width", "calc(100% - 280px)");
    $(".navigation-container").css("width", "calc(100% - 280px)");
  }
}
function closeNav() {
  document.getElementById("app-nav").style.width = "0";
  $("#main-content").css("width", "100%");
  $(".navigation-container").css("width", "100%");
}

export default Home;
