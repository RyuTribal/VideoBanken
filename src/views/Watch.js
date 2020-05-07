import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import Plyr from "plyr";
import Player from "./components/player/Player";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import ShowMore from "react-show-more";
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import MDReactComponent from "markdown-react-js";
import { isMobile, browserName } from "react-device-detect";
const formatter = buildFormatter(swedishStrings);

let that;
class Watch extends Component {
  constructor() {
    super();
    this.state = {
      video: "",
      key: "",
      videoDetails: {},
      tags: {},
      videoID: "",
      comments: [],
      liked: false,
      disliked: false,
      likeColor: "#",
      likes: "",
      dislikes: "",
      offset: 0,
    };
    this._isMounted = false;
    this.playerRef = React.createRef();
  }
  async componentDidMount() {
    this._isMounted = true;
    that = this;
    let videoID;
    const username = "";
    let userInformation;
    await Auth.currentAuthenticatedUser({
      bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        this.username = user.username;
        if (this._isMounted) {
          this.setState({
            username: user.username,
          });
        }

        if (
          user.attributes["custom:firstTime"] == "0" ||
          user.attributes["custom:firstTime"] == undefined
        ) {
          API.graphql(
            graphqlOperation(mutations.addUser, {
              input: {
                username: user.username,
              },
            })
          )
            .then((result) => {
              Auth.updateUserAttributes(user, {
                "custom:firstTime": "1",
              })
                .then((res) => {})
            })
        }
      })
      .catch((err) => {
        this.props.history.push("/login");
      });
    if (this.props.history.location.search == "") {
      this.props.history.push(`/home`);
    } else if (
      this.props.history.location.search.split("?")[1] == undefined ||
      this.props.history.location.search.split("?")[1].split("=")[0] != "key"
    ) {
      this.props.history.push(`/home`);
    } else {
      this.props.onChange("None");
      videoID = this.props.history.location.search.split("?")[1].split("=")[1];
    }
    let videoDetails = {};
    let videoUrl = "";
    let videoTags = {};
    if (this._isMounted) {
      this.setState({
        key: videoID,
      });
    }

    await API.graphql(
      graphqlOperation(queries.getVideo, {
        input: {
          id: videoID,
        },
      })
    )
      .then(function (result) {
        videoDetails = result.data.getVideo;
      })
    await API.graphql(
      graphqlOperation(queries.getTags, {
        input: {
          videoID: videoID,
        },
      })
    ).then((result) => {
      videoTags = result.data.getTags;
    });
    await Storage.get(`uploads/${videoID}.mp4`).then(function (result) {
      videoUrl = result;
    });
    if (videoDetails.views == null) {
      videoDetails.views = "0";
    }
    if (videoDetails.comments == null) {
      videoDetails.comments = "[]";
    }
    await API.graphql(
      graphqlOperation(queries.getLikes, {
        videoID: videoID,
      })
    ).then((result) => {
      for (let i = 0; i < result.data.getLikes.length; i++) {
        if (
          result.data.getLikes[i].username === this.state.username &&
          this._isMounted
        ) {
          this.setState({
            liked: true,
            likeColor: "#24a0ed",
          });
        }
      }
      if (this._isMounted) {
        this.setState({
          likes: result.data.getLikes.length,
        });
      }
    });
    await API.graphql(
      graphqlOperation(queries.getDislikes, {
        videoID: videoID,
      })
    ).then((result) => {
      for (let i = 0; i < result.data.getDislikes.length; i++) {
        if (
          result.data.getDislikes[i].username === this.state.username &&
          this._isMounted
        ) {
          this.setState({
            disliked: true,
            dislikeColor: "#d8000c",
          });
        }
      }
      if (this._isMounted) {
        this.setState({
          dislikes: result.data.getDislikes.length,
        });
      }
    });
    let comments;
    let nextToken;
    await API.graphql(
      graphqlOperation(queries.getComments, {
        offset: this.state.offset,
        input: {
          videoID: videoID,
        },
      })
    ).then((res) => {
      comments = res.data.getComments;
    });
    if (this._isMounted) {
      this.setState({
        video: videoUrl,
        videoDetails: videoDetails,
        tags: videoTags,
        comments: comments,
        ammountComments: videoDetails.ammountComments,
        offset: this.state.offset + 20,
      });
    }

    if (this.state.ammountComments > 20) {
      document.getElementsByClassName("content_1hrfb9k")[0].addEventListener("scroll", this.trackScrolling);
    }
    const likeButton = document.getElementById("like-button");
    const dislikeButton = document.getElementById("dislike-button");
    if (likeButton) {
      likeButton.addEventListener("click", function () {
        that.handleLikes(that.username, videoID);
      });
    }
    if (dislikeButton) {
      dislikeButton.addEventListener("click", function () {
        that.handleDisLikes(that.username, videoID, userInformation);
      });
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    document.getElementsByClassName("content_1hrfb9k")[0].removeEventListener("scroll", this.trackScrolling);
    clearInterval();
  };

  handleLikes = async (username, videoID) => {
    if (this.state.disliked === true) {
      this.setState({
        liked: true,
        disliked: false,
        likeColor: "#24a0ed",
        dislikeColor: "#909090",
        likes: this.state.likes + 1,
        dislikes: this.state.dislikes - 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendDislike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "-",
          },
        })
      ).catch((err) => {});
      await API.graphql(
        graphqlOperation(mutations.sendLike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "+",
          },
        })
      );
    } else if (this.state.liked === true) {
      this.setState({
        liked: false,
        likeColor: "#909090",
        likes: this.state.likes - 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendLike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "-",
          },
        })
      ).catch((err) => {});
    } else if (this.state.liked === false && this.state.disliked === false) {
      this.setState({
        liked: true,
        likeColor: "#24a0ed",
        likes: this.state.likes + 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendLike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "+",
          },
        })
      );
    }
  };

  trackScrolling = (e) => {
    const wrappedElement = document.getElementById("comments-wrapper");
    if (this.isBottom(wrappedElement)) {
      document.getElementsByClassName("content_1hrfb9k")[0].removeEventListener("scroll", this.trackScrolling);
      this.getMoreComments();
    }
  };

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  getMoreComments = async () => {
    await API.graphql(
      graphqlOperation(queries.getComments, {
        input: {
          videoID: this.state.comments[0].videoID,
        },
        offset: this.state.offset,
      })
    ).then((res) => {
      let comments = this.state.comments;
      for (let i = 0; i < res.data.getComments.length; i++) {
        comments.push(res.data.getComments[i]);
      }
      this.setState({
        offset: this.state.offset + 20,
        comments: comments,
      });
      document.getElementsByClassName("content_1hrfb9k")[0].addEventListener("scroll", this.trackScrolling);
    });
  };

  async handleDisLikes(username, videoID) {
    if (this.state.liked === true) {
      this.setState({
        disliked: true,
        liked: false,
        likeColor: "#909090",
        dislikeColor: "#d8000c",
        likes: this.state.likes - 1,
        dislikes: this.state.dislikes + 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendLike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "-",
          },
        })
      ).catch((err) => {});
      await API.graphql(
        graphqlOperation(mutations.sendDislike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "+",
          },
        })
      );
    } else if (this.state.disliked === true) {
      this.setState({
        disliked: false,
        dislikeColor: "#909090",
        dislikes: this.state.dislikes - 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendDislike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "-",
          },
        })
      ).catch((err) => {});
    } else if (this.state.disliked === false && this.state.liked === false) {
      this.setState({
        disliked: true,
        dislikeColor: "#d8000c",
        dislikes: this.state.dislikes + 1,
      });
      await API.graphql(
        graphqlOperation(mutations.sendDislike, {
          input: {
            username: username,
            videoID: videoID,
            conditional: "+",
          },
        })
      );
    }
  }

  downloadVideo() {
    const videoURL = $("source").attr("src");
    window.location.href = videoURL;
  }

  handleComments = async () => {
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

      commentArray = this.state.comments;

      await API.graphql(
        graphqlOperation(mutations.addComment, {
          input: {
            videoID: this.state.key,
            username: this.username,
            comment: comment,
          },
        })
      )
        .then((result) => {
          let newComment = result.data.addComment;
          commentArray.push(newComment);
          this.setState({
            comments: commentArray,
            ammountComments: this.state.ammountComments + 1,
          });
        })
    }
  };

  updateComments = (editedComment) => {
    let previousComments = this.state.comments;
    for (let i = 0; i < previousComments.length; i++) {
      if (previousComments[i].id === editedComment.id) {
        previousComments[i] = editedComment;
      }
      this.setState({
        comments: previousComments,
      });
    }
  };

  removeComment = (commentID) => {
    let previousComments = this.state.comments;
    for (let i = 0; i < previousComments.length; i++) {
      if (previousComments[i].id === commentID) {
        previousComments.splice(i, 1);
      }
    }
    this.setState({
      comments: previousComments,
      ammountComments: this.state.ammountComments - 1,
    });
  };

  addEvents = () => {
    this.playerRef.current.addEvents();
  };

  removeEvents = () => {
    this.playerRef.current.removeEvents();
  };

  render() {
    let numberLikes = 0;
    let numberDislikes = 0;
    if (this.state.likes == null) {
      numberLikes = 0;
    } else if (this.state.likes >= 1000 && this.state.likes < 1000000) {
      numberLikes = Math.round(this.state.likes / 1000) + "tn";
    } else if (this.state.likes >= 1000000 && this.state.likes < 1000000000) {
      numberLikes = Math.round(this.state.likes / 1000000) + "mn";
    } else if (this.state.likes >= 1000000000) {
      numberLikes = Math.round(this.state.likes / 1000000000) + "md";
    } else {
      numberLikes = this.state.likes;
    }
    if (this.state.dislikes == null) {
      numberDislikes = 0;
    } else if (this.state.dislikes >= 1000 && this.state.dislikes < 1000000) {
      numberDislikes = Math.round(this.state.dislikes / 1000) + "tn";
    } else if (
      this.state.dislikes >= 1000000 &&
      this.state.dislikes < 1000000000
    ) {
      numberDislikes = Math.round(this.state.dislikes / 1000000) + "mn";
    } else if (this.state.dislikes >= 1000000000) {
      numberDislikes = Math.round(this.state.dislikes / 1000000000) + "md";
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
      tags = JSON.parse(this.state.tags);
    } catch {
      tags = [];
    }
    let comments = this.state.comments;
    return (
      <div className="video-container">
        <Player
          ref={this.playerRef}
          video={this.state.video}
          videoID={this.state.key}
        />
        <div className="details-comments-wrapper">
          <div className="details-wrapper">
            <div className="title-wrapper">
              <h2>{this.state.videoDetails.title}</h2>
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
                    {this.state.videoDetails.description + " "}
                  </ShowMore>
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
                </div>
              </div>
            </div>
            <div id="comments-wrapper" className="comments-wrapper">
              <div className="ammount-comments-wrapper">
                <h3>{this.state.ammountComments} kommentarer</h3>
              </div>
              <div className="post-comment-wrapper">
                <div className="error">Kommentaren kan inte vara tom</div>
                <div
                  onFocus={this.removeEvents}
                  onBlur={this.addEvents}
                  contenteditable="true"
                  className="comment-field"
                  id="new-comment"
                  placeholder="Lägg till en ny kommentar..."
                  aria-label="Lägg till en kommentar..."
                ></div>
                <button
                  onClick={this.handleComments}
                  className="comment-submit"
                  id="post-comment"
                >
                  Kommentera
                </button>
              </div>
              <div
                id="posted-comments"
                className="posted-comments"
              >
                {comments.map((comment, i) => (
                  <CommentBox
                    key={i}
                    comment={comment}
                    videoDetails={this.state.videoDetails}
                    username={this.username}
                    updateComments={this.updateComments}
                    removeComment={this.removeComment}
                    addEvents={this.addEvents}
                    removeEvents={this.removeEvents}
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
let commentClass;
class CommentBox extends Component {
  constructor() {
    super();
    this.elemRef = React.createRef();
    this.state = {
      replies: [],
      ammountReplies: "",
      isEdited: false,
      likeColor: "#909090",
      dislikeColor: "#909090",
      liked: false,
      disliked: false,
      likes: "",
      dislikes: "",
      nextToken: "",
      openBox: false,
      moreReplies: false,
      editable: false,
      showOptions: false,
      offset: 0,
      replyFieldOpen: false,
    };
    this._isMounted = false;
  }
  async componentDidMount() {
    this._isMounted = true;
    commentClass = this;
    let commentLikes = await API.graphql(
      graphqlOperation(queries.getCommentLikes, {
        commentID: this.props.comment.id,
      })
    ).then((result) => {
      return result.data.getCommentLikes;
    });
    let commentDislikes = await API.graphql(
      graphqlOperation(queries.getCommentDislikes, {
        commentID: this.props.comment.id,
      })
    ).then((result) => {
      return result.data.getCommentDislikes;
    });
    this.setState({
      isEdited: this.props.comment.isEdited,
      likes: commentLikes.length,
      dislikes: commentDislikes.length,
      ammountReplies: this.props.comment.ammountReplies,
    });
    if (this.props.comment.ammountReplies > 5) {
      this.setState({
        moreReplies: true,
      });
    }
    if (commentLikes != null) {
      for (let i = 0; i < commentLikes.length; i++) {
        if (commentLikes[i].username == this.props.username) {
          this.setState({
            liked: true,
            likeColor: "#24a0ed",
          });
        }
      }
    }
    if (commentDislikes != null) {
      for (let i = 0; i < commentDislikes.length; i++) {
        if (commentDislikes[i].username == this.props.username) {
          this.setState({
            disliked: true,
            dislikeColor: "#d8000c",
          });
        }
      }
    }
    document.addEventListener("click", this.checkOutsideClick, false);
  }

  componentWillUnmount = (async) => {
    this._isMounted = false;
    document.removeEventListener("click", this.checkOutsideClick, false);
  };
  handleReplies = async (id, el) => {
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
        graphqlOperation(mutations.addReply, {
          input: {
            videoID: this.props.comment.videoID,
            username: this.props.username,
            comment: reply,
            commentID: id,
          },
        })
      ).then((res) => {
        return res.data.addReply;
      });
      let replies = this.state.replies;
      replies.push(reply);
      this.setState({
        replies: replies,
        ammountReplies: this.state.ammountReplies + 1,
      });
    }
  };
  handleCommentLikes = async (commentID, id) => {
    let username = this.props.username;
    if (id === "reply-like-button") {
      if (this.state.disliked === true) {
        this.setState({
          liked: true,
          disliked: false,
          likeColor: "#24a0ed",
          dislikeColor: "#909090",
          likes: this.state.likes + 1,
          dislikes: this.state.dislikes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeComment, {
            input: {
              username: username,
              commentID: commentID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
        await API.graphql(
          graphqlOperation(mutations.likeComment, {
            input: {
              username: username,
              commentID: commentID,
              videoID: this.props.comment.videoID,
              conditional: "+",
            },
          })
        );
      } else if (this.state.liked === true) {
        this.setState({
          liked: false,
          likeColor: "#909090",
          likes: this.state.likes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeComment, {
            input: {
              username: username,
              commentID: commentID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
      } else if (this.state.liked === false && this.state.disliked === false) {
        this.setState({
          liked: true,
          likeColor: "#24a0ed",
          likes: this.state.likes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeComment, {
            input: {
              username: username,
              commentID: commentID,
              videoID: this.props.comment.videoID,
              conditional: "+",
            },
          })
        );
      }
    } else if (id === "reply-dislike-button") {
      if (this.state.liked === true) {
        this.setState({
          disliked: true,
          liked: false,
          likeColor: "#909090",
          dislikeColor: "#d8000c",
          likes: this.state.likes - 1,
          dislikes: this.state.dislikes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeComment, {
            input: {
              username: username,
              commentID: commentID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
        await API.graphql(
          graphqlOperation(mutations.dislikeComment, {
            input: {
              username: username,
              commentID: commentID,
              videoID: this.props.comment.videoID,
              conditional: "+",
            },
          })
        );
      } else if (this.state.disliked === true) {
        this.setState({
          disliked: false,
          dislikeColor: "#909090",
          dislikes: this.state.dislikes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeComment, {
            input: {
              username: username,
              commentID: commentID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
      } else if (this.state.disliked === false && this.state.liked === false) {
        this.setState({
          disliked: true,
          dislikeColor: "#d8000c",
          dislikes: this.state.dislikes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeComment, {
            input: {
              username: username,
              commentID: commentID,
              videoID: this.props.comment.videoID,
              conditional: "+",
            },
          })
        );
      }
    }
  };

  loadMoreReplies = async () => {
    let commentReplies = await API.graphql(
      graphqlOperation(queries.getReplies, {
        offset: this.state.offset,
        input: {
          commentID: this.props.comment.id,
        },
      })
    ).then((res) => {
      return res.data.getReplies;
    });
    let currentReplies = this.state.replies;
    let combinedArray = [...currentReplies, ...commentReplies];
    this.setState({
      replies: combinedArray,
      offset: this.state.offset + 5,
    });
    if (this.state.ammountReplies == this.state.replies.length) {
      this.setState({
        moreReplies: false,
      });
    }
  };

  closeMoreOptions = () => {
    $("body").css("overflow", "auto");
    document
      .getElementsByClassName("mobile-more-options")[0]
      .classList.remove("mobile-options-show");
    $(".overlay").css("display", "");
    $(
      document
        .getElementsByClassName("mobile-more-options")[0]
        .querySelector(".edit-text")
    ).unbind();

    $(
      document
        .getElementsByClassName("mobile-more-options")[0]
        .querySelector(".delete-comment")
    ).unbind();

    document
      .getElementsByClassName("overlay")[0]
      .removeEventListener("click", this.closeMoreOptions);
  };

  deleteComment = async (el) => {
    await API.graphql(
      graphqlOperation(mutations.deleteComment, {
        input: {
          id: this.props.comment.id,
          videoID: this.props.comment.videoID,
        },
      })
    ).then((res) => {
      this.setState({
        replies: [],
        ammountReplies: "",
        isEdited: false,
        likeColor: "#909090",
        dislikeColor: "#909090",
        liked: false,
        disliked: false,
        likes: "",
        dislikes: "",
        nextToken: "",
        openBox: false,
        moreReplies: false,
        editable: false,
        showOptions: false,
        offset: 0,
        replyFieldOpen: false,
      });
      this.props.removeComment(this.props.comment.id);
    });
  };

  editComment = async () => {
    if (isMobile) {
      this.closeMoreOptions();
    }
    this.setState({
      editable: true,
    });
  };

  saveEdit = async (e) => {
    const errorNode = e.currentTarget.parentNode.children[0];
    const editedText = e.currentTarget.parentNode.children[1].innerHTML;
    if (editedText == "" || !/\S/.test(editedText)) {
      errorNode.classList.add("error-visible");
    } else {
      let editedComment = await API.graphql(
        graphqlOperation(mutations.editComment, {
          input: {
            id: this.props.comment.id,
            comment: editedText,
          },
        })
      ).then((res) => {
        return res.data.editComment;
      });
      this.props.updateComments(editedComment);
      this.setState({
        editable: false,
        isEdited: true,
      });
    }
  };

  closeMoreOptions = () => {
    this.setState({
      showOptions: false,
    });
    $("body").removeClass("noscroll");
  };

  handleMoreOptions = () => {
    if (this.state.showOptions === false) {
      this.setState({
        showOptions: true,
      });
    } else if (this.state.showOptions === true) {
      this.setState({
        showOptions: false,
      });
      $(".tooltip").blur();
    }

    if (isMobile) {
      $("body").addClass("noscroll");
    }
  };
  checkOutsideClick = (e) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      if (this.state.showOptions === true) {
        this.setState({
          showOptions: false,
        });
      }
    }
  };
  updateReplies = (editedReply) => {
    let previousReplies = this.state.replies;
    for (let i = 0; i < previousReplies.length; i++) {
      if (previousReplies[i].id === editedReply.id) {
        previousReplies[i] = editedReply;
      }
      this.setState({
        replies: previousReplies,
      });
    }
  };
  removeReply = (replyID) => {
    let previousReplies = this.state.replies;
    for (let i = 0; i < previousReplies.length; i++) {
      if (previousReplies[i].id === replyID) {
        previousReplies.splice(i, 1);
      }
    }
    this.setState({
      replies: previousReplies,
      ammountReplies: this.state.ammountReplies - 1,
    });
  };
  handleReplyField = () => {
    if (this.state.replyFieldOpen === true) {
      this.setState({ replyFieldOpen: false });
    } else if (this.state.replyFieldOpen === false) {
      this.setState({ replyFieldOpen: true });
    }
  };
  openReplies = async (el) => {
    if (this.state.openBox === false) {
      this.setState({
        openBox: true,
      });
    } else if (this.state.openBox === true) {
      this.setState({
        openBox: false,
      });
    }
    if (this.state.replies.length < 1) {
      let commentReplies = await API.graphql(
        graphqlOperation(queries.getReplies, {
          offset: this.state.offset,
          input: {
            commentID: this.props.comment.id,
          },
        })
      ).then((res) => {
        return res.data.getReplies;
      });
      this.setState({
        replies: commentReplies,
        offset: this.state.offset + 5,
        replyFieldOpen: false,
      });
    }
  };
  render() {
    return (
      <div className="comment-wrapper">
        {this.state.showOptions === true && isMobile === true && (
          <div onClick={this.closeMoreOptions} className="overlay"></div>
        )}
        {this.state.showOptions === true && isMobile === true && (
          <div className="mobile-more-options">
            <div onClick={() => this.editComment()} className="edit-text">
              <i className="fas fa-edit"></i>
              {` Edit comment`}
            </div>
            <hr></hr>
            <div
              onClick={() => this.deleteComment()}
              className="delete-comment"
            >
              <i className="fas fa-trash"></i>
              {` Delete comment`}
            </div>
          </div>
        )}
        {this.state.editable === false ? (
          <div className="comment-details-wrapper">
            <div className="username-wrapper">
              <Link to={`profile/${this.props.comment.username}`}>
                {this.props.comment.username}
              </Link>{" "}
              <TimeAgo
                className="time-ago"
                date={this.props.comment.createdAt}
                formatter={formatter}
              />
              {" " + (this.state.isEdited === true ? "(edited)" : "")}
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
                    this.props.comment.id,
                    "reply-like-button"
                  )
                }
              >
                <i
                  style={{ color: this.state.likeColor }}
                  className="fas fa-thumbs-up"
                ></i>
                <p>{this.state.likes}</p>
              </button>
              <button
                className="likes-dislikes-buttons"
                id="reply-dislike-button"
                onClick={() =>
                  this.handleCommentLikes(
                    this.props.comment.id,
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
                onClick={() => this.handleReplyField()}
                className="likes-dislikes-buttons"
                id="reply-answer-button"
              >
                <b>Svara</b>
              </button>
              {this.props.comment.username === this.props.username && (
                <button
                  onClick={this.handleMoreOptions}
                  className={
                    "likes-dislikes-buttons tooltip more-options " +
                    (isMobile ||
                    (this.state.showOptions === true && isMobile === false)
                      ? "tooltipshow"
                      : "")
                  }
                >
                  <i className="fas fa-ellipsis-v"></i>
                  {this.state.showOptions === true && isMobile === false && (
                    <span className="tooltiptext">
                      <div
                        onClick={() => this.editComment()}
                        className="edit-text"
                      >
                        <i className="fas fa-edit"></i>
                        {` Edit comment`}
                      </div>
                      <div
                        onClick={() => this.deleteComment()}
                        className="delete-comment"
                      >
                        <i className="fas fa-trash"></i>
                        {` Delete comment`}
                      </div>
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-comment-field">
            <div className="error">Kommentaren kan inte vara tom</div>
            <div
              contenteditable="true"
              className="comment-field editable-comment"
              id="edit-field"
              placeholder="Lägg till en ny kommentar..."
              aria-label="Lägg till en ny kommentar..."
            >
              {this.props.comment.comment}
            </div>
            <button
              onClick={() => this.setState({ editable: false })}
              className="comment-submit"
              id="cancel-comment"
            >
              Avbryt
            </button>
            <button
              onClick={this.saveEdit}
              className="comment-submit"
              id="edit-comment"
            >
              Spara
            </button>
          </div>
        )}
        {this.state.replyFieldOpen === true && (
          <div className="reply-field-container">
            <div className="error">Kommentaren kan inte vara tom</div>
            <div
              onFocus={this.props.removeEvents}
              onBlur={this.props.addEvents}
              contenteditable="true"
              className="comment-field"
              id="new-reply"
              placeholder="Lägg till en ny kommentar..."
              aria-label="Lägg till ett svar..."
            ></div>
            <button
              className="comment-submit"
              onClick={(el) => this.handleReplies(this.props.comment.id, el)}
              id="post-reply"
            >
              Svara
            </button>
          </div>
        )}
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
        {this.state.openBox === true && (
          <div className="replies-container">
            {this.state.replies.map((reply, i) => (
              <ReplyBox
                key={i}
                reply={reply}
                username={this.props.username}
                updateReplies={this.updateReplies}
                removeReply={this.removeReply}
              />
            ))}
            {this.state.moreReplies == true && (
              <div onClick={this.loadMoreReplies} className="view-replies">
                {`Visa fler svar`}
              </div>
            )}
          </div>
        )}
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
      dislikes: [],
      showOptions: false,
      editable: false,
      isEdited: false,
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this.props.reply.isEdited === true) {
      this.setState({
        isEdited: true,
      });
    }
    let replyLikes = await API.graphql(
      graphqlOperation(queries.getReplyLikes, {
        replyID: this.props.reply.id,
      })
    ).then((res) => {
      return res.data.getReplyLikes;
    });
    let replyDislikes = await API.graphql(
      graphqlOperation(queries.getReplyDislikes, {
        replyID: this.props.reply.id,
      })
    ).then((res) => {
      return res.data.getReplyDislikes;
    });
    this.setState({
      likes: replyLikes.length,
      dislikes: replyDislikes.length,
    });
    for (let i = 0; i < replyLikes.length; i++) {
      if (replyLikes[i].username == this.props.username) {
        this.setState({
          liked: true,
          likeColor: "#24a0ed",
        });
      }
    }
    for (let i = 0; i < replyDislikes.length; i++) {
      if (replyDislikes[i].username == this.props.username) {
        this.setState({
          disliked: true,
          dislikeColor: "#d8000c",
        });
      }
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  handleReplyLikes = async (replyID, id) => {
    let username = this.props.username;

    if (id === "reply-like-button") {
      if (this.state.disliked === true) {
        this.setState({
          liked: true,
          disliked: false,
          likeColor: "#24a0ed",
          dislikeColor: "#909090",
          likes: this.state.likes + 1,
          dislikes: this.state.dislikes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeReply, {
            input: {
              username: username,
              replyID: replyID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
        await API.graphql(
          graphqlOperation(mutations.likeReply, {
            input: {
              username: username,
              replyID: replyID,
              commentID: this.props.reply.commentID,
              videoID: this.props.reply.videoID,
              conditional: "+",
            },
          })
        );
      } else if (this.state.liked === true) {
        this.setState({
          liked: false,
          likeColor: "#909090",
          likes: this.state.likes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeReply, {
            input: {
              username: username,
              replyID: replyID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
      } else if (this.state.liked === false && this.state.disliked === false) {
        this.setState({
          liked: true,
          likeColor: "#24a0ed",
          likes: this.state.likes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeReply, {
            input: {
              username: username,
              replyID: replyID,
              commentID: this.props.reply.commentID,
              videoID: this.props.reply.videoID,
              conditional: "+",
            },
          })
        );
      }
    } else if (id === "reply-dislike-button") {
      if (this.state.liked === true) {
        this.setState({
          disliked: true,
          liked: false,
          likeColor: "#909090",
          dislikeColor: "#d8000c",
          likes: this.state.likes - 1,
          dislikes: this.state.dislikes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.likeReply, {
            input: {
              username: username,
              replyID: replyID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
        await API.graphql(
          graphqlOperation(mutations.dislikeReply, {
            input: {
              username: username,
              replyID: replyID,
              commentID: this.props.reply.commentID,
              videoID: this.props.reply.videoID,
              conditional: "+",
            },
          })
        );
      } else if (this.state.disliked === true) {
        this.setState({
          disliked: false,
          dislikeColor: "#909090",
          dislikes: this.state.dislikes - 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeReply, {
            input: {
              username: username,
              replyID: replyID,
              conditional: "-",
            },
          })
        ).catch((err) => {});
      } else if (this.state.disliked === false && this.state.liked === false) {
        this.setState({
          disliked: true,
          dislikeColor: "#d8000c",
          dislikes: this.state.dislikes + 1,
        });
        await API.graphql(
          graphqlOperation(mutations.dislikeReply, {
            input: {
              username: username,
              replyID: replyID,
              commentID: this.props.reply.commentID,
              videoID: this.props.reply.videoID,
              conditional: "+",
            },
          })
        );
      }
    }
  };
  closeMoreOptions = () => {
    this.setState({
      showOptions: false,
    });
    $("body").removeClass("noscroll");
  };

  handleMoreOptions = () => {
    if (this.state.showOptions === false) {
      this.setState({
        showOptions: true,
      });
    } else if (this.state.showOptions === true) {
      this.setState({
        showOptions: false,
      });
      $(".tooltip").blur();
    }

    if (isMobile) {
      $("body").addClass("noscroll");
    }
  };
  checkOutsideClick = (e) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      if (this.state.showOptions === true) {
        this.setState({
          showOptions: false,
        });
      }
    }
  };
  editReply = () => {
    if (isMobile) {
      this.closeMoreOptions();
    }
    this.setState({
      editable: true,
    });
  };
  saveEdit = async (e) => {
    const errorNode = e.currentTarget.parentNode.children[0];
    const editedText = e.currentTarget.parentNode.children[1].innerHTML;
    if (editedText == "" || !/\S/.test(editedText)) {
      errorNode.classList.add("error-visible");
    } else {
      let editedReply = await API.graphql(
        graphqlOperation(mutations.editReply, {
          input: {
            id: this.props.reply.id,
            comment: editedText,
          },
        })
      ).then((res) => {
        return res.data.editReply;
      });
      this.props.updateReplies(editedReply);
      this.setState({
        editable: false,
        isEdited: true,
      });
    }
  };

  deleteReply = async (replyID) => {
    await API.graphql(
      graphqlOperation(mutations.deleteReply, {
        input: {
          id: replyID,
          commentID: this.props.reply.commentID,
        },
      })
    )
      .then((res) => {
        this.props.removeReply(replyID);
      })
      .catch((err) => {
      });
  };
  render() {
    return (
      <div className="reply-wrapper">
        {this.state.showOptions === true && isMobile === true && (
          <div onClick={this.closeMoreOptions} className="overlay"></div>
        )}
        {this.state.showOptions === true && isMobile === true && (
          <div className="mobile-more-options">
            <div
              onClick={() => this.editReply(this.props.reply.id)}
              className="edit-text"
            >
              <i className="fas fa-edit"></i>
              {` Edit reply`}
            </div>
            <hr></hr>
            <div
              onClick={() => this.deleteReply(this.props.reply.id)}
              className="delete-comment"
            >
              <i className="fas fa-trash"></i>
              {` Delete reply`}
            </div>
          </div>
        )}
        {this.state.editable === false ? (
          <div className="reply-inner-wrapper">
            <div className="username-wrapper">
              <Link to={`profile/${this.props.reply.username}`}>
                {this.props.reply.username}
              </Link>{" "}
              <TimeAgo
                className="time-ago"
                date={this.props.reply.createdAt}
                formatter={formatter}
              />
              {" " + (this.state.isEdited === true ? "(edited)" : "")}
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
                    this.props.reply.id,
                    "reply-like-button"
                  )
                }
              >
                <i
                  style={{ color: this.state.likeColor }}
                  className="fas fa-thumbs-up"
                ></i>
                <p>{this.state.likes}</p>
              </button>
              <button
                className="likes-dislikes-buttons"
                id="reply-dislike-button"
                onClick={() =>
                  this.handleReplyLikes(
                    this.props.reply.id,
                    "reply-dislike-button"
                  )
                }
              >
                <i
                  style={{ color: this.state.dislikeColor }}
                  className="fas fa-thumbs-down"
                ></i>
              </button>
              {this.props.reply.username === this.props.username && (
                <button
                  onClick={this.handleMoreOptions}
                  className={
                    "likes-dislikes-buttons tooltip more-options " +
                    (isMobile ||
                    (this.state.showOptions === true && isMobile === false)
                      ? "tooltipshow"
                      : "")
                  }
                >
                  <i className="fas fa-ellipsis-v"></i>
                  {this.state.showOptions === true && isMobile === false && (
                    <span className="tooltiptext">
                      <div
                        onClick={() => this.editReply(this.props.reply.id)}
                        className="edit-text"
                      >
                        <i className="fas fa-edit"></i>
                        {` Edit reply`}
                      </div>
                      <div
                        onClick={() => this.deleteReply(this.props.reply.id)}
                        className="delete-comment"
                      >
                        <i className="fas fa-trash"></i>
                        {` Delete reply`}
                      </div>
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-comment-field">
            <div className="error">Kommentaren kan inte vara tom</div>
            <div
              contenteditable="true"
              className="comment-field editable-comment"
              id="edit-field"
              placeholder="Lägg till en ny kommentar..."
              aria-label="Lägg till en ny kommentar..."
            >
              {this.props.reply.comment}
            </div>
            <button
              onClick={() => this.setState({ editable: false })}
              className="comment-submit"
              id="cancel-comment"
            >
              Avbryt
            </button>
            <button
              onClick={this.saveEdit}
              className="comment-submit"
              id="edit-comment"
            >
              Spara
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Watch;
