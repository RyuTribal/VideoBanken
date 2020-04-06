import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
const formatter = buildFormatter(swedishStrings);
class HomeFeed extends Component {
  constructor() {
    super();
    this.state = { details: [], rows: [], offset: 0};
  }
  async componentDidMount(prevProps) {
    let videos = "";
    let rows = [];
    await Auth.currentAuthenticatedUser({
      bypassCache: true // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        console.log(user);
        if (user.attributes["custom:firstTime"] == "0" || user.attributes["custom:firstTime"] == undefined) {
          console.log("yeah here");
          API.graphql(
            graphqlOperation(mutations.addUser, {
              input: {
                username: user.username
              }
            })
          )
            .then(result => {
              Auth.updateUserAttributes(user, {
                "custom:firstTime": "1"
              }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/login");
      });
    await API.graphql(graphqlOperation(queries.getVideos, {offset: this.state.offset})).then(
      function(result) {
        console.log(result);
        videos = result.data.getVideos;
        let ammountRows = 1;
        for (let i = 0; i < videos.length; i++) {
          if (i == 0) {
            rows.push(0);
          } else if (i > 5 || i > 5 * ammountRows) {
            ammountRows++;
            rows.push(ammountRows);
          }
        }
      }
    );
    for (let i = 0; i < videos.length; i++) {
    await Storage.get(`uploads/${videos[i].thumbnail}.png`)
        .then(function(result) {
          videos[i].thumbnail = result;
          if (videos[i].views == null) {
            videos[i].views = "0";
          }

          if (videos[i].title.length > 50) {
            videos[i].title =
              videos[i].title.substring(0, 47) + "...";
          }
          const ammountViews = JSON.parse(videos[i].views);
          console.log(ammountViews);
          if (ammountViews >= 1000 && ammountViews < 1000000) {
            videos[i].views = Math.round(ammountViews / 1000) + "tn";
          } else if (ammountViews >= 1000000 && ammountViews < 1000000000) {
            videos[i].views = Math.round(ammountViews / 1000000) + "mn";
          } else if (ammountViews >= 1000000000) {
            videos[i].views = Math.round(ammountViews / 1000000000) + "md";
          } else if (ammountViews == null) {
            videos[i].views = 0;
          } else {
            videos[i].views = ammountViews;
          }
        })
        .catch(err => console.log(err));
    }
    this.setState({ details: videos, rows: rows });
  }
  redirectToVideo(videoID) {
    this.props.history.push({
      pathname: `${this.props.match.path}/watch`,
      search: `?key=${videoID}`
    });
  }
  render() {
    console.log(this.state.details);
    return (
      <section className="feed-container">
        {this.state.details.map((details, i) => (
          <div
            onClick={() => this.redirectToVideo(details.id)}
            key={i}
            className="video-preview"
          >
            <img src={details.thumbnail}></img>
            <div className="video-details">
              <div className="video-title-wrap">
                <h3 className="video-title">{details.title}</h3>
              </div>
              <div className="date-username-wrap">
                <a className="video-username">{details.username}</a>
                <p className="likes-dates">
                  {`${details.views} visningar `}
                  <span className="bullelements">&#x25cf;</span>
                  {` `}
                  <TimeAgo
                    className="time-ago"
                    date={details.createdAt}
                    formatter={formatter}
                  />
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }
}

export default HomeFeed;
