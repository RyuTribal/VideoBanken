import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import ReactPlayer from "react-player";
import { Slider, Direction, PlayerIcon, Button } from "react-player-controls";
import Plyr from "plyr";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import ShowMore from "react-show-more";
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import MDReactComponent from "markdown-react-js";
const formatter = buildFormatter(swedishStrings);

let that;
class Watch extends Component {
  constructor() {
    super();
    this.state = {
      video: "",
      videoDetails: {},
      key: "",
      mime: "",
      ammountComments: "",
      comments: [],
      liked: false,
      disliked: false,
      likeColor: "#",
      likes: "",
      dislikes: "",
      nextToken: ""
    };
  }
  async componentDidMount() {
    that = this;
    let key;
    let mime;
    const username = "";
    let userInformation;
    await Auth.currentAuthenticatedUser({
      bypassCache: true // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        this.username = user.username;
        console.log(user);
        if (
          user.attributes["custom:firstTime"] == "0" ||
          user.attributes["custom:firstTime"] == undefined
        ) {
          console.log("yeah here");
          API.graphql(
            graphqlOperation(mutations.createUserStorage, {
              input: {
                username: user.username,
                likedVideos: "[]",
                dislikedVideos: "[]"
              }
            })
          )
            .then(result => {
              Auth.updateUserAttributes(user, {
                "custom:firstTime": "1"
              })
                .then(res => {})
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/login");
      });
    if (this.props.history.location.search == "") {
      this.props.history.push(`/home`);
    } else if (
      this.props.history.location.search.split("?")[1].split("&")[1] ==
        undefined ||
      this.props.history.location.search
        .split("?")[1]
        .split("&")[0]
        .split("=")[0] != "key" ||
      this.props.history.location.search
        .split("?")[1]
        .split("&")[1]
        .split("=")[0] != "mime"
    ) {
      this.props.history.push(`/home`);
    } else {
      key = this.props.history.location.search
        .split("?")[1]
        .split("&")[0]
        .split("=")[1];
      mime = this.props.history.location.search
        .split("?")[1]
        .split("&")[1]
        .split("=")[1];
    }
    let videoDetails = {};
    let videoUrl = "";
    this.setState({
      key: key,
      mime: mime
    });
    console.log(`uploads/${key}.${mime}`);
    await API.graphql(
      graphqlOperation(queries.getVideoStorage, {
        videoKey: `uploads/${key}.${mime}`
      })
    )
      .then(function(result) {
        console.log(result);
        videoDetails = result.data.getVideoStorage;
      })
      .catch(err => console.log(err));
    await Storage.get(`uploads/${key}.${mime}`).then(function(result) {
      videoUrl = result;
    });
    if (videoDetails.views == null) {
      videoDetails.views = "0";
    }
    if (videoDetails.likes == null) {
      videoDetails.likes = "0";
    }
    if (videoDetails.dislikes == null) {
      videoDetails.dislikes = "0";
    }
    if (videoDetails.comments == null) {
      videoDetails.comments = "[]";
    }
    console.log(this.username);
    await API.graphql(
      graphqlOperation(queries.getUserStorage, {
        username: this.username
      })
    )
      .then(function(result) {
        if (result.data.getUserStorage == null) {
        } else {
          if (result.data.getUserStorage.likedVideos == null) {
            result.data.getUserStorage.likedVideos = "[]";
          }
          if (result.data.getUserStorage.dislikedVideos == null) {
            result.data.getUserStorage.dislikedVideos = "[]";
          }
          userInformation = result.data.getUserStorage;
          for (
            let i = 0;
            i < JSON.parse(result.data.getUserStorage.likedVideos).length;
            i++
          ) {
            if (
              `uploads/${key}.${mime}` ==
              JSON.parse(result.data.getUserStorage.likedVideos)[i]
            ) {
              that.setState({
                liked: true,
                likeColor: "#24a0ed",
                dislikeColor: "#909090"
              });
            }
          }

          for (
            let i = 0;
            i < JSON.parse(result.data.getUserStorage.dislikedVideos).length;
            i++
          ) {
            if (
              `uploads/${key}.${mime}` ==
              JSON.parse(result.data.getUserStorage.dislikedVideos)[i]
            ) {
              that.setState({
                disliked: true,
                likeColor: "#909090",
                dislikeColor: "#d8000c"
              });
            }
          }
        }
      })
      .catch(err => console.log(err));
    let comments;
    let nextToken;
    await API.graphql(
      graphqlOperation(queries.listCommentStorages, {
        videoKey: `uploads/${key}.${mime}`,
        limit: 20
      })
    ).then(res => {
      console.log(res);
      nextToken = res.data.listCommentStorages.nextToken;
      comments = res.data.listCommentStorages.items;
      if (comments.length > 20) {
        document.addEventListener("scroll", this.trackScrolling);
      }
    });
    console.log(comments);
    this.setState({
      video: videoUrl,
      videoDetails: videoDetails,
      mime: `video/${mime}`,
      likes: JSON.parse(videoDetails.likes),
      dislikes: JSON.parse(videoDetails.dislikes),
      comments: comments,
      ammountComments: videoDetails.ammountComments,
      nextToken: nextToken
    });
    const player = new Plyr("#player", {
      title: this.state.videoDetails.videoTitle
    });
    let secondsVideoPlayed = 0;
    window.setInterval(function() {
      if (player.playing) {
        if (Math.round(player.currentTime) < secondsVideoPlayed) {
        } else if (Math.round(player.currentTime) > secondsVideoPlayed) {
          secondsVideoPlayed++;
          that.sendView(
            secondsVideoPlayed,
            player,
            videoDetails.views,
            key,
            mime
          );
        }
      } else {
      }
    }, 1000);
    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");
    console.log(userInformation);
    likeButton.addEventListener("click", function() {
      that.handleLikes(this.username, key, mime, userInformation);
    });
    dislikeButton.addEventListener("click", function() {
      that.handleDisLikes(this.username, key, mime, userInformation);
    });
  }

  handleLikes = async (username, key, mime, userInformation) => {
    let likesArray, dislikesArray;
    console.log(userInformation)
    let video = await API.graphql(
      graphqlOperation(queries.getVideoStorage, {
        videoKey: `uploads/${key}.${mime}`
      })
    ).then(res => {
      return res.data.getVideoStorage;
    });
    let videoLikes = JSON.parse(video.likes);
    let videoDislikes = JSON.parse(video.dislikes);
    try {
      likesArray = JSON.parse(userInformation.likedVideos);
    } catch {
      console.log("we are here");
      likesArray = userInformation.likedVideos;
    }
    try {
      dislikesArray = JSON.parse(userInformation.dislikedVideos);
    } catch {
      console.log("we are here");
      dislikesArray = userInformation.dislikedVideos;
    }
    console.log(userInformation.likedVideos);
    if (this.state.disliked == true) {
      dislikesArray = dislikesArray.filter(e => e !== `uploads/${key}.${mime}`);
      this.setState({
        disliked: false,
        dislikes: JSON.parse(this.state.dislikes) - 1
      });
      videoDislikes = videoDislikes - 1;
    }
    if (this.state.liked == false) {
      if (userInformation == null) {
        userInformation = {
          username: username,
          likedVideos: [`uploads/${key}.${mime}`],
          dislikedVideos: []
        };
      } else {
        console.log("here we are");
        likesArray.push(`uploads/${key}.${mime}`);
        console.log(likesArray);
        userInformation.likedVideos = likesArray;
        userInformation.dislikedVideos = dislikesArray;
      }
      this.setState({
        liked: true,
        likes: JSON.parse(this.state.likes) + 1
      });
      videoLikes = videoLikes + 1;
      this.setState({ likeColor: "#24a0ed", dislikeColor: "#909090" });
    } else if (this.state.liked == true) {
      likesArray = likesArray.filter(e => e !== `uploads/${key}.${mime}`);
      userInformation.likedVideos = likesArray;
      this.setState({
        liked: false,
        likes: JSON.parse(this.state.likes) - 1
      });
      videoLikes = videoLikes - 1;
      this.setState({ likeColor: "#909090", dislikeColor: "#909090" });
    }
    let userLikes = JSON.stringify(userInformation.likedVideos);
    let userDislikes = JSON.stringify(userInformation.dislikedVideos);
    await API.graphql(
      graphqlOperation(mutations.updateUserStorage, {
        input: {
          username: userInformation.username,
          likedVideos: userLikes,
          dislikedVideos: userDislikes
        }
      })
    ).catch(err => console.log(err));
    await API.graphql(
      graphqlOperation(mutations.updateVideoStorage, {
        input: {
          videoKey: `uploads/${key}.${mime}`,
          likes: videoLikes,
          dislikes: videoDislikes
        }
      })
    ).catch(err => console.log(err));
  };

  trackScrolling = () => {
    const wrappedElement = document.getElementById("comments-wrapper");
    if (this.isBottom(wrappedElement)) {
      console.log("comment bottom reached");
      document.removeEventListener("scroll", this.trackScrolling);
      this.getMoreComments();
    }
  };

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  getMoreComments = async () => {
    await API.graphql(
      graphqlOperation(queries.listCommentStorages, {
        videoKey: `uploads/${this.state.key}.${this.state.mime.split("/")[1]}`,
        limit: 20,
        nextToken: this.state.nextToken
      })
    ).then(res => {
      let comments = this.state.comments;
      for (let i = 0; i < res.data.listCommentStorages.items.length; i++) {
        comments.push(res.data.listCommentStorages.items[i]);
      }
      console.log(comments);
      this.setState({
        nextToken: res.data.listCommentStorages.nextToken,
        comments: comments
      });
      if (this.state.comments.length != this.state.ammountComments) {
        document.addEventListener("scroll", this.trackScrolling);
      }
      console.log(this.state.comments);
    });
  };

  async handleDisLikes(username, key, mime, userInformation) {
    let likesArray, dislikesArray;
    try {
      likesArray = JSON.parse(userInformation.likedVideos);
    } catch {
      console.log("we are here");
      likesArray = userInformation.likedVideos;
    }
    try {
      dislikesArray = JSON.parse(userInformation.dislikedVideos);
    } catch {
      console.log("we are here");
      dislikesArray = userInformation.dislikedVideos;
    }
    console.log(dislikesArray);
    if (this.state.liked == true) {
      likesArray = likesArray.filter(e => e !== `uploads/${key}.${mime}`);
      this.setState({
        liked: false,
        likes: JSON.parse(this.state.likes) - 1
      });
    }
    if (this.state.disliked == false) {
      if (userInformation == null) {
        userInformation = {
          username: username,
          likedVideos: [],
          dislikedVideos: [`uploads/${key}.${mime}`]
        };
      } else {
        console.log("here we are");
        dislikesArray.push(`uploads/${key}.${mime}`);
        console.log(likesArray);
        userInformation.likedVideos = likesArray;
        userInformation.dislikedVideos = dislikesArray;
      }
      this.setState({
        disliked: true,
        dislikes: JSON.parse(this.state.dislikes) + 1
      });
      this.setState({ likeColor: "#909090", dislikeColor: "#d8000c" });
    } else if (this.state.disliked == true) {
      dislikesArray = dislikesArray.filter(e => e !== `uploads/${key}.${mime}`);
      userInformation.dislikedVideos = dislikesArray;
      this.setState({
        disliked: false,
        dislikes: JSON.parse(this.state.dislikes) - 1
      });
      this.setState({ likeColor: "#909090", dislikeColor: "#909090" });
    }
    let userLikes = JSON.stringify(userInformation.likedVideos);
    let userDislikes = JSON.stringify(userInformation.dislikedVideos);
    await API.graphql(
      graphqlOperation(mutations.updateUserStorage, {
        input: {
          username: userInformation.username,
          likedVideos: userLikes,
          dislikedVideos: userDislikes
        }
      })
    ).catch(err => console.log(err));
    await API.graphql(
      graphqlOperation(mutations.updateVideoStorage, {
        input: {
          videoKey: `uploads/${key}.${mime}`,
          likes: this.state.likes,
          dislikes: this.state.dislikes
        }
      })
    );
  }

  async sendView(seconds, player, views, key, mime) {
    let watchTimeLimit = 0;
    if (player.duration < 30) {
      watchTimeLimit = Math.floor(player.duration);
    } else {
      watchTimeLimit = 30;
    }
    if (seconds == watchTimeLimit) {
      clearInterval();
      const updatedVideo = await API.graphql(
        graphqlOperation(mutations.updateVideoStorage, {
          input: {
            videoKey: `uploads/${key}.${mime}`,
            views: JSON.stringify(parseInt(views) + 1)
          }
        })
      )
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }
  }

  downloadVideo() {
    const videoURL = $("source").attr("src");
    window.location.href = videoURL;
  }

  handleComments() {
    let commentArray;
    if (
      $("#new-comment").text() == "" ||
      !/\S/.test($("#new-comment").text())
    ) {
      $(".error").addClass("error-visible");
    } else {
      $(".error").removeClass("error-visible");
      const comment = $("#new-comment").text();
      $("#new-comment").empty();

      commentArray = that.state.comments;
      commentArray.push({
        videoKey: `uploads/${that.state.key}.${that.state.mime.split("/")[1]}`,
        username: that.username,
        comment: comment,
        createdAt: new Date().toISOString(),
        ammountReplies: "0",
        likes: "[]",
        dislikes: "[]"
      });
      that.setState({
        comments: commentArray
      });
      console.log(`uploads/${that.state.key}.${that.state.mime}`);

      API.graphql(
        graphqlOperation(mutations.createCommentStorage, {
          input: {
            videoKey: `uploads/${that.state.key}.${
              that.state.mime.split("/")[1]
            }`,
            username: that.username,
            comment: comment,
            createdAt: new Date().toISOString(),
            ammountReplies: "0",
            likes: "[]",
            dislikes: "[]"
          }
        })
      )
        .then(result => {
          API.graphql(
            graphqlOperation(queries.getVideoStorage, {
              videoKey: `uploads/${that.state.key}.${
                that.state.mime.split("/")[1]
              }`
            })
          )
            .then(result => {
              let currentComments = result.data.getVideoStorage.ammountComments;
              API.graphql(
                graphqlOperation(mutations.updateVideoStorage, {
                  input: {
                    videoKey: `uploads/${that.state.key}.${
                      that.state.mime.split("/")[1]
                    }`,
                    ammountComments: JSON.stringify(
                      parseInt(currentComments) + 1
                    )
                  }
                })
              )
                .then(result => console.log(result))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
    clearInterval();
  }

  render() {
    let numberLikes = 0;
    let numberDislikes = 0;
    if (this.state.likes >= 1000 && this.state.likes < 1000000) {
      numberLikes = Math.round(this.state.likes / 1000) + "tn";
    } else if (this.state.likes >= 1000000 && this.state.likes < 1000000000) {
      numberLikes = Math.round(this.state.likes / 1000000) + "mn";
    } else if (this.state.likes >= 1000000000) {
      numberLikes = Math.round(this.state.likes / 1000000000) + "md";
    } else if (this.state.likes == null) {
      numberLikes = 0;
    } else {
      numberLikes = this.state.likes;
    }
    if (this.state.dislikes >= 1000 && this.state.dislikes < 1000000) {
      numberDislikes = Math.round(this.state.dislikes / 1000) + "tn";
    } else if (
      this.state.dislikes >= 1000000 &&
      this.state.dislikes < 1000000000
    ) {
      numberDislikes = Math.round(this.state.dislikes / 1000000) + "mn";
    } else if (this.state.dislikes >= 1000000000) {
      numberDislikes = Math.round(this.state.dislikes / 1000000000) + "md";
    } else if (this.state.dislikes == null) {
      numberDislikes = 0;
    } else {
      numberDislikes = this.state.dislikes;
    }
    let likesPercentage;
    try {
      likesPercentage =
        (JSON.parse(this.state.likes) /
          (JSON.parse(this.state.likes) + JSON.parse(this.state.dislikes))) *
        100;
    } catch {
      likesPercentage = 0;
    }
    let tags;
    try {
      tags = JSON.parse(this.state.videoDetails.tags);
    } catch {
      tags = [];
    }
    let comments = this.state.comments;
    console.log(comments);
    return (
      <div className="video-container">
        <video id="player" playsInline controls preload autoPlay>
          <source src={this.state.video} type={this.state.mime} />
        </video>
        <div className="details-comments-wrapper">
          <div className="details-wrapper">
            <div className="title-wrapper">
              <h2>{this.state.videoDetails.videoTitle}</h2>
            </div>
            <div className="likes-date-wrapper">
              <p className="likes-dates">
                <NumberFormat
                  value={this.state.videoDetails.views}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                {` visningar `}
                <span className="bullelements">&#x25cf;</span>
                {` `}
                <Moment format="D MMM YYYY" withTitle>
                  {this.state.videoDetails.createdAt}
                </Moment>
              </p>
              <div className="likes-dislikes">
                <div className="likes-dislikes-button-wrap">
                  <button className="likes-dislikes-buttons" id="like-button">
                    <i
                      style={{ color: this.state.likeColor }}
                      className="fas fa-thumbs-up"
                    ></i>
                    <p>{numberLikes}</p>
                  </button>
                  <button
                    className="likes-dislikes-buttons"
                    id="dislike-button"
                  >
                    <i
                      style={{ color: this.state.dislikeColor }}
                      className="fas fa-thumbs-down"
                    ></i>
                    <p>{numberDislikes}</p>
                  </button>
                  <div className="like-progress-wrap">
                    <div
                      style={{ width: `${likesPercentage}%` }}
                      className="likes-progress"
                    ></div>
                  </div>
                </div>
                <button
                  id="download-button"
                  className="likes-dislikes-buttons"
                  onClick={this.downloadVideo}
                >
                  <i className="fas fa-download"></i>
                  <p>Ladda ner</p>
                </button>
              </div>
            </div>
            <div className="username-description-wrap">
              <div className="username-wrapper">
                <Link to={`profile/${this.state.videoDetails.username}`}>
                  {this.state.videoDetails.username}
                </Link>
              </div>
              <div className="description-wrapper">
                <div className="description">
                  <ShowMore
                    lines={5}
                    more="Visa mer"
                    less="Visa mindre"
                    anchorClass="read-more"
                  >
                    {this.state.videoDetails.videoDesc}
                    <div className="desc-tags">
                      <h4>Tags:</h4>
                      {tags.map((tag, i) => (
                        <div key={i} className="desc-tag">
                          <Link to="">{tag}</Link>,
                        </div>
                      ))}
                    </div>
                    <div className="desc-category">
                      <h4>Kategori:</h4>
                      <Link to="">
                        <h4>{this.state.videoDetails.category}</h4>
                      </Link>
                    </div>
                  </ShowMore>
                </div>
              </div>
            </div>
            <div id="comments-wrapper" className="comments-wrapper">
              <div className="ammount-comments-wrapper">
                <h3>{this.state.videoDetails.ammountComments} kommentarer</h3>
              </div>
              <div className="post-comment-wrapper">
                <div className="error">Kommentaren kan inte vara tom</div>
                <div
                  contenteditable="true"
                  id="new-comment"
                  placeholder="Lägg till en ny kommentar..."
                  aria-label="Lägg till en kommentar..."
                ></div>
                <button onClick={this.handleComments} id="post-comment">
                  Kommentera
                </button>
              </div>
              <div id="posted-comments" className="posted-comments">
                {comments.map((comment, i) => (
                  <CommentBox
                    key={i}
                    comment={comment}
                    videoDetails={this.state.videoDetails}
                    username={this.username}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      replies: [],
      ammountReplies: "",
      likeColor: "#909090",
      dislikeColor: "#909090",
      liked: false,
      disliked: false,
      likes: [],
      dislikes: [],
      nextToken: "",
      openBox: false,
      moreReplies: false
    };
  }

  async componentDidMount() {
    this.setState({
      likes: JSON.parse(this.props.comment.likes),
      dislikes: JSON.parse(this.props.comment.dislikes),
      ammountReplies: JSON.parse(this.props.comment.ammountReplies)
    });
    if (JSON.parse(this.props.comment.ammountReplies) > 5) {
      this.setState({
        moreReplies: true
      });
    }
    for (let i = 0; i < JSON.parse(this.props.comment.likes).length; i++) {
      if (JSON.parse(this.props.comment.likes)[i] == this.props.username) {
        this.setState({
          liked: true,
          likeColor: "#24a0ed"
        });
      }
    }
    for (let i = 0; i < JSON.parse(this.props.comment.dislikes).length; i++) {
      if (JSON.parse(this.props.comment.dislikes)[i] == this.props.username) {
        this.setState({
          disliked: true,
          dislikeColor: "#d8000c"
        });
      }
    }
  }
  handleReplies = async (key, el) => {
    console.log(key);
    console.log(el.currentTarget);
    let replyField = el.currentTarget.parentNode.getElementsByTagName("div")[1];
    let replyArray;
    if (replyField.innerHTML == "" || !/\S/.test($(replyField).text())) {
      replyField.parentNode
        .getElementsByTagName("div")[0]
        .classList.add("error-visible");
    } else {
      let reply = $(replyField).text();
      replyField.innerHTML = "";
      reply = await API.graphql(
        graphqlOperation(mutations.createReplyStorage, {
          input: {
            commentKey: key,
            username: this.props.username,
            comment: reply,
            createdAt: new Date().toISOString(),
            likes: "[]",
            dislikes: "[]"
          }
        })
      ).then(res => {
        return res.data.createReplyStorage;
      });
      let comment = await API.graphql(
        graphqlOperation(queries.getCommentStorage, {
          commentKey: key,
          videoKey: this.props.comment.videoKey
        })
      ).then(res => {
        return res.data.getCommentStorage;
      });
      let ammountReplies = JSON.parse(comment.ammountReplies);
      replyArray = this.state.replies;
      replyArray.push(reply);
      console.log(replyArray);
      this.setState({
        replies: replyArray,
        ammountReplies: this.state.ammountReplies + 1
      });
      console.log(this.props.comment.videoKey);
      await API.graphql(
        graphqlOperation(mutations.updateCommentStorage, {
          input: {
            commentKey: key,
            videoKey: this.props.comment.videoKey,
            ammountReplies: JSON.stringify(ammountReplies + 1)
          }
        })
      );
    }
  };
  handleCommentLikes = async (key, videoKey, id) => {
    let comment = await API.graphql(
      graphqlOperation(queries.getCommentStorage, {
        commentKey: key,
        videoKey: videoKey
      })
    ).then(res => {
      return res.data.getCommentStorage;
    });
    let likes = JSON.parse(comment.likes);
    let dislikes = JSON.parse(comment.dislikes);
    console.log(comment);
    if (id === "reply-like-button") {
      if (this.state.liked === true) {
        this.setState({
          liked: false,
          likeColor: "#909090"
        });
        const index = likes.indexOf(this.props.username);
        likes.splice(index, 1);
      } else if (this.state.liked === false) {
        this.setState({
          liked: true,
          disliked: false,
          likeColor: "#24a0ed",
          dislikeColor: "#909090"
        });
        likes.push(this.props.username);
        const index = dislikes.indexOf(this.props.username);
        if (index > -1) {
          dislikes.splice(index, 1);
        }
      }
    } else if (id === "reply-dislike-button") {
      if (this.state.disliked === true) {
        this.setState({
          disliked: false,
          dislikeColor: "#909090"
        });
        const index = dislikes.indexOf(this.props.username);
        dislikes.splice(index, 1);
      } else if (this.state.disliked === false) {
        this.setState({
          liked: false,
          disliked: true,
          likeColor: "#909090",
          dislikeColor: "#d8000c"
        });
        dislikes.push(this.props.username);
        const index = likes.indexOf(this.props.username);
        if (index > -1) {
          likes.splice(index, 1);
        }
      }
    }
    comment.likes = JSON.stringify(likes);
    comment.dislikes = JSON.stringify(dislikes);
    console.log(comment);
    this.setState({
      likes: JSON.parse(comment.likes),
      dislikes: JSON.parse(comment.dislikes)
    });
    await API.graphql(
      graphqlOperation(mutations.updateCommentStorage, {
        input: {
          commentKey: key,
          videoKey: videoKey,
          likes: comment.likes,
          dislikes: comment.dislikes
        }
      })
    );
    console.log(id);
  };
  handleReplyContainer = el => {
    console.log("hey");
    console.log(el.currentTarget);
    let replyContainer = el.currentTarget.parentNode.parentNode.getElementsByClassName(
      "reply-field-container"
    )[0];
    replyContainer.classList.toggle("show-container");
    let replyField = replyContainer.getElementsByTagName("div")[1];
    replyField.focus();
  };

  openReplies = async el => {
    let replyWrapper = el.currentTarget.parentNode.parentNode.getElementsByClassName(
      "replies-container"
    )[0];
    if (this.state.openBox === false) {
      this.setState({
        openBox: true
      });
    } else if (this.state.openBox === true) {
      this.setState({
        openBox: false
      });
    }
    console.log(replyWrapper);
    console.log(this.props.comment.commentKey)
    let commentKey = this.props.comment.commentKey;
    replyWrapper.classList.toggle("show-container");
    if (this.state.replies.length < 1) {
      let commentReplies = await API.graphql(
        graphqlOperation(queries.listReplyStorages, {
          commentKey: commentKey,
          limit: 5
        })
      ).then(res => {
        console.log(res)
        return res.data.listReplyStorages;
      });
      this.setState({
        replies: commentReplies.items,
        nextToken: commentReplies.nextToken
      });
    }
  };

  loadMoreReplies = async () => {
    let commentReplies = await API.graphql(
      graphqlOperation(queries.listReplyStorages, {
        limit: 5,
        nextToken: this.state.nextToken,
        commentKey: this.props.comment.commentKey
      })
    ).then(res => {
      return res.data.listReplyStorages;
    });
    let currentReplies = this.state.replies;
    for (let i = 0; i < commentReplies.items.length; i++) {
      currentReplies.push(commentReplies.items[i]);
    }
    this.setState({
      replies: currentReplies,
      nextToken: commentReplies.nextToken
    });
    if (commentReplies.nextToken == null) {
      this.setState({
        moreReplies: false
      });
    }
  };
  render() {
    return (
      <div className="comment-wrapper">
        <div className="username-wrapper">
          <Link to={`profile/${this.props.comment.username}`}>
            {this.props.comment.username}
          </Link>{" "}
          <TimeAgo
            className="time-ago"
            date={this.props.comment.createdAt}
            formatter={formatter}
          />
        </div>
        <div className="comment">
          <MDReactComponent text={this.props.comment.comment} />
        </div>
        <div className="comment-likes">
          <button
            className="likes-dislikes-buttons"
            id="reply-like-button"
            onClick={() =>
              this.handleCommentLikes(
                this.props.comment.commentKey,
                this.props.comment.videoKey,
                "reply-like-button"
              )
            }
          >
            <i
              style={{ color: this.state.likeColor }}
              className="fas fa-thumbs-up"
            ></i>
            <p>{this.state.likes.length}</p>
          </button>
          <button
            className="likes-dislikes-buttons"
            id="reply-dislike-button"
            onClick={() =>
              this.handleCommentLikes(
                this.props.comment.commentKey,
                this.props.comment.videoKey,
                "reply-dislike-button"
              )
            }
          >
            <i
              style={{ color: this.state.dislikeColor }}
              className="fas fa-thumbs-down"
            ></i>
          </button>
          <button
            onClick={this.handleReplyContainer}
            className="likes-dislikes-buttons"
            id="reply-answer-button"
          >
            <b>Svara</b>
          </button>
        </div>
        <div className="reply-field-container">
          <div className="error">Kommentaren kan inte vara tom</div>
          <div
            contenteditable="true"
            id="new-reply"
            placeholder="Lägg till en ny kommentar..."
            aria-label="Lägg till ett svar..."
          ></div>
          <button
            onClick={el =>
              this.handleReplies(this.props.comment.commentKey, el)
            }
            id="post-reply"
          >
            Svara
          </button>
        </div>
        {this.state.ammountReplies > 0 && (
          <div className="ammount-replies">
            {this.state.openBox === false ? (
              <div onClick={this.openReplies} className="view-replies">
                <i
                  style={{ verticalAlign: "top" }}
                  className="fas fa-sort-down"
                ></i>
                {` Visa ${this.state.ammountReplies} svar`}
              </div>
            ) : (
              <div onClick={this.openReplies} className="view-replies">
                <i className="fas fa-sort-up"></i>
                {` Dölj svar`}
              </div>
            )}
          </div>
        )}

        <div className="replies-container">
          {this.state.replies.map((reply, i) => (
            <ReplyBox key={i} reply={reply} username={this.props.username} />
          ))}
          {this.state.moreReplies == true && (
            <div onClick={this.loadMoreReplies} className="view-replies">
              {`Visa fler svar`}
            </div>
          )}
        </div>
      </div>
    );
  }
}

class ReplyBox extends Component {
  constructor() {
    super();
    this.state = {
      likeColor: "#909090",
      dislikeColor: "#909090",
      liked: false,
      disliked: false,
      likes: [],
      dislikes: []
    };
  }

  async componentDidMount() {
    this.setState({
      likes: JSON.parse(this.props.reply.likes),
      dislikes: JSON.parse(this.props.reply.dislikes)
    });
    for (let i = 0; i < JSON.parse(this.props.reply.likes).length; i++) {
      if (JSON.parse(this.props.reply.likes)[i] == this.props.username) {
        this.setState({
          liked: true,
          likeColor: "#24a0ed"
        });
      }
    }
    for (let i = 0; i < JSON.parse(this.props.reply.dislikes).length; i++) {
      if (JSON.parse(this.props.reply.dislikes)[i] == this.props.username) {
        this.setState({
          disliked: true,
          dislikeColor: "#d8000c"
        });
      }
    }
  }

  handleReplyLikes = async (key, commentKey, id) => {
    let comment = await API.graphql(
      graphqlOperation(queries.getReplyStorage, {
        replyKey: key,
        commentKey: commentKey
      })
    ).then(res => {
      return res.data.getReplyStorage;
    });
    let likes = JSON.parse(comment.likes);
    let dislikes = JSON.parse(comment.dislikes);
    console.log(comment);
    if (id === "reply-like-button") {
      if (this.state.liked === true) {
        this.setState({
          liked: false,
          likeColor: "#909090"
        });
        const index = likes.indexOf(this.props.username);
        likes.splice(index, 1);
      } else if (this.state.liked === false) {
        this.setState({
          liked: true,
          disliked: false,
          likeColor: "#24a0ed",
          dislikeColor: "#909090"
        });
        likes.push(this.props.username);
        const index = dislikes.indexOf(this.props.username);
        if (index > -1) {
          dislikes.splice(index, 1);
        }
      }
    } else if (id === "reply-dislike-button") {
      if (this.state.disliked === true) {
        this.setState({
          disliked: false,
          dislikeColor: "#909090"
        });
        const index = dislikes.indexOf(this.props.username);
        dislikes.splice(index, 1);
      } else if (this.state.disliked === false) {
        this.setState({
          liked: false,
          disliked: true,
          likeColor: "#909090",
          dislikeColor: "#d8000c"
        });
        dislikes.push(this.props.username);
        const index = likes.indexOf(this.props.username);
        if (index > -1) {
          likes.splice(index, 1);
        }
      }
    }
    comment.likes = JSON.stringify(likes);
    comment.dislikes = JSON.stringify(dislikes);
    console.log(comment);
    this.setState({
      likes: JSON.parse(comment.likes),
      dislikes: JSON.parse(comment.dislikes)
    });
    await API.graphql(
      graphqlOperation(mutations.updateReplyStorage, {
        input: {
          replyKey: key,
          commentKey: commentKey,
          likes: comment.likes,
          dislikes: comment.dislikes
        }
      })
    );
    console.log(id);
  };
  render() {
    return (
      <div className="reply-wrapper">
        <div className="username-wrapper">
          <Link to={`profile/${this.props.reply.username}`}>
            {this.props.reply.username}
          </Link>{" "}
          <TimeAgo
            className="time-ago"
            date={this.props.reply.createdAt}
            formatter={formatter}
          />
        </div>
        <div className="reply">
          <MDReactComponent text={this.props.reply.comment} />
        </div>
        <div className="comment-likes">
          <button
            className="likes-dislikes-buttons"
            id="reply-like-button"
            onClick={() =>
              this.handleReplyLikes(
                this.props.reply.replyKey,
                this.props.reply.commentKey,
                "reply-like-button"
              )
            }
          >
            <i
              style={{ color: this.state.likeColor }}
              className="fas fa-thumbs-up"
            ></i>
            <p>{this.state.likes.length}</p>
          </button>
          <button
            className="likes-dislikes-buttons"
            id="reply-dislike-button"
            onClick={() =>
              this.handleReplyLikes(
                this.props.reply.replyKey,
                this.props.reply.commentKey,
                "reply-dislike-button"
              )
            }
          >
            <i
              style={{ color: this.state.dislikeColor }}
              className="fas fa-thumbs-down"
            ></i>
          </button>
        </div>
      </div>
    );
  }
}

export default Watch;
