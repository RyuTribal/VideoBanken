import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
// import Moment from "react-moment";
var that;
class HomeFeed extends Component {
  constructor() {
    super();
    this.state = { details: [], rows: [] };
  }
  async componentDidMount(prevProps) {
    that = this;
    let videos = "";
    let rows = [];
    await Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).catch(err => that.props.history.push("/login"));
    await API.graphql(graphqlOperation(queries.listVideoStorages)).then(
      function(result) {
        console.log(result);
        console.log(result.data.listVideoStorages.items[0].username);
        videos = result.data.listVideoStorages.items;
        let ammountRows = 1;
        for (let i = 0; i < videos.length; i++) {
          if(i == 0){
            rows.push(0);
          }
          else if(i > 5 || i > 5*ammountRows){
            ammountRows++;
            rows.push(ammountRows);
          }
        }
        
      }
    );
    for (let i = 0; i < videos.length; i++) {
      await Storage.get(videos[i].thumbKey)
        .then(function(result) {
          videos[i].thumbKey = result;
          console.log(videos);
        })
        .catch(err => console.log(err));
    }
    this.setState({ details: videos, rows: rows });
  }
  redirectToVideo(videoKey){
    
  }
  render() {
    console.log(this.state.details);
    return (
      <section className="feed-container">
        {this.state.details.map((details, i) => (
          <div onClick={() => this.redirectToVideo(details.videoKey)} key={i} className="video-preview">
            <img src={details.thumbKey}></img>
            <div className="video-details">
              <div className="video-title-wrap">
                <h3 className="video-title">{details.videoTitle}</h3>
              </div>
              <a className="video-username">{details.username}</a>
            </div>
          </div>
        ))}
      </section>
    );
  }
}

export default HomeFeed;
