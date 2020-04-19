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
  async componentDidMount(prevProps) {
    that = this;
    $("html").click(function () {
      closeNav();
    });

    $("#app-nav").click(function (event) {
      event.stopPropagation();
    });

    $(".closebtn").click(function () {
      closeNav();
    });

    $("#logout-btn").click(function () {
      Auth.signOut()
        .then((data) => that.props.history.push("/login"))
        .catch((err) => console.log(err));
    });
  }

  redirectToVideo() {
    this.props.history.push(`${this.props.match.path}/video-upload`);
  }
  componentWillUnmount() {
    $("html").unbind();
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <div id="app-nav" className="home-navigation">
            <a href="javascript:void(0)" className="closebtn">
              ×
            </a>
            <Link to={`${this.props.match.path}/`}>About</Link>
            <Link href="#">Services</Link>
            <Link href="#">Clients</Link>
            <Link href="#">Contact</Link>
          </div>
          <main id="main-content" className="content-container">
            <nav className="navigation-container">
              {isMobile === false && (
                <div className="search-wrapper">
                  <input className="search-bar" placeholder="Sök..."></input>
                  <button id="logout-btn" className="confirm-search">
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
