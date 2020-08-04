import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import Plyr from "plyr";
import Player from "./components/vanilla-player/Player";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import ShowMore from "react-show-more";
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import MDReactComponent from "markdown-react-js";
import { isMobile, browserName } from "react-device-detect";
import { Skeleton } from "@material-ui/lab";
import {
  Avatar,
  Button,
  ButtonBase,
  TextField,
  ThemeProvider,
  CircularProgress,
} from "@material-ui/core";
import theme from "../theme";
import { ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
const formatter = buildFormatter(swedishStrings);

let that;
class Watch extends Component {
  constructor() {
    super();
    this.state = {
      video: "",
      key: "",
      videoDetails: null,
      tags: {},
      videoID: "",
      comments: null,
      liked: false,
      disliked: false,
      likeColor: "#",
      likes: 0,
      dislikes: 0,
      offset: 0,
      username: "",
      img: null,
      newCommentValue: "",
      ammountComments: 0,
    };
    this._isMounted = false;
    this.playerRef = React.createRef();
  }
  componentDidMount = async () => {
    this._isMounted = true;
    that = this;
    let videoID;
    const currentUser = await Auth.currentAuthenticatedUser();
    const username = currentUser.username;
    this.setState({ username: username });
    let userInformation;
    this.props.onChange(null);
    console.log(this.props);
    videoID = this.props.match.params.video;
    let videoDetails = {};
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
    ).then(function (result) {
      videoDetails = result.data.getVideo;
    });
    await API.graphql(
      graphqlOperation(queries.getTags, {
        input: {
          videoID: videoID,
        },
      })
    ).then((result) => {
      videoTags = result.data.getTags;
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
        videoDetails: videoDetails,
        tags: videoTags,
        comments: comments,
        ammountComments: videoDetails.ammountComments,
        offset: this.state.offset + 20,
      });
    }

    if (this.state.ammountComments > 20) {
      document
        .getElementsByClassName("content_1hrfb9k")[0]
        .addEventListener("scroll", this.trackScrolling);
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
    await this.getProfileImg(this.state.videoDetails.username);
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    clearInterval();
  };
  getProfileImg = async (username) => {
    const image = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    this.setState({ img: image });
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
      document
        .getElementsByClassName("content_1hrfb9k")[0]
        .removeEventListener("scroll", this.trackScrolling);
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
      document
        .getElementsByClassName("content_1hrfb9k")[0]
        .addEventListener("scroll", this.trackScrolling);
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
    if (/^\s*$/.test(this.state.newCommentValue)) {
    } else {
      this.setState({ newCommentValue: "" });

      await API.graphql(
        graphqlOperation(mutations.addComment, {
          input: {
            videoID: this.state.key,
            username: this.state.username,
            comment: escape(this.state.newCommentValue),
          },
        })
      ).then((result) => {
        this.setState((prevState) => ({
          comments: [...prevState.comments, result.data.addComment],
          ammountComments: this.state.ammountComments + 1,
        }));
      });
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
    let tags;
    try {
      tags = JSON.parse(this.state.tags);
    } catch {
      tags = [];
    }
    return (
      <div className="video-container">
        <Player
          ref={this.playerRef}
          playerRef={this.props.playerRef}
          shortcuts={true}
          settings={true}
          pip={true}
          fullscreen={true}
          timeThumb={true}
          ref={this.playerRef}
          videoID={this.state.key}
          mobileControls={isMobile}
          sendViews={true}
          fullScreenEnter={(conditional) =>
            this.props.fullScreenEnter(conditional)
          }
        />
        <div className="details-comments-wrapper">
          <div className="details-wrapper">
            <div className="title-wrapper">
              {this.state.videoDetails ? (
                <h2>{this.state.videoDetails.title}</h2>
              ) : (
                <Skeleton
                  style={{
                    marginBlockStart: "0.83em",
                    marginBlockEnd: "0.83em",
                  }}
                  variant="rect"
                  width="70%"
                  height={50}
                />
              )}
            </div>
            <div className="likes-date-wrapper">
              <p className="likes-dates">
                {this.state.videoDetails ? (
                  <NumberFormat
                    value={this.state.videoDetails.views}
                    displayType={"text"}
                    thousandSeparator={true}
                    style={{ marginRight: "0.25em" }}
                  />
                ) : (
                  <Skeleton
                    style={{ marginRight: "0.25em" }}
                    variant="text"
                    width="10%"
                  />
                )}
                {` visningar `}
                <span className="bullelements">&#x25cf;</span>
                {` `}
                {this.state.videoDetails ? (
                  <Moment format="D MMM YYYY" withTitle>
                    {this.state.videoDetails.createdAt}
                  </Moment>
                ) : (
                  <Skeleton variant="text" width="30%" />
                )}
              </p>
              <div className="likes-dislikes">
                <div className="likes-dislikes-button-wrap">
                  <ButtonBase id="like-button">
                    <i
                      style={{ color: this.state.likeColor }}
                      className="fas fa-thumbs-up"
                    ></i>
                    <p>{numberLikes}</p>
                  </ButtonBase>
                  <ButtonBase id="dislike-button">
                    <i
                      style={{ color: this.state.dislikeColor }}
                      className="fas fa-thumbs-down"
                    ></i>
                    <p>{numberDislikes}</p>
                  </ButtonBase>
                </div>
                <ButtonBase id="download-button" onClick={this.downloadVideo}>
                  <i className="fas fa-download"></i>
                  <p>Ladda ner</p>
                </ButtonBase>
              </div>
            </div>
            <div className="username-description-wrap">
              <div className="username-wrapper">
                {this.state.videoDetails ? (
                  <Link
                    className="username-link"
                    to={`/home/users/${this.state.videoDetails.username}`}
                  >
                    <Avatar
                      style={{ marginRight: "0.25em" }}
                      className="username-profile-picture"
                      src={this.state.img}
                    ></Avatar>
                    {this.state.videoDetails.username}
                  </Link>
                ) : (
                  <div className="username-link">
                    <Skeleton
                      style={{ marginRight: "0.25em" }}
                      variant="circle"
                      width={50}
                      height={50}
                    />
                    <Skeleton variant="text" width={90} />
                  </div>
                )}
              </div>
              <div className="description-wrapper">
                <div className="description">
                  {this.state.videoDetails ? (
                    <ShowMore
                      lines={5}
                      more="Visa mer"
                      less="Visa mindre"
                      anchorClass="read-more"
                    >
                      {this.state.videoDetails.description + " "}
                    </ShowMore>
                  ) : (
                    <Skeleton type="text" width="70%" />
                  )}

                  <div className="desc-tags">
                    <h4>Tags:</h4>
                    {tags.map((tag, i) => (
                      <div key={i} className="desc-tag">
                        <Link to="">{tag}</Link>,
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div id="comments-wrapper" className="comments-wrapper">
              <div className="ammount-comments-wrapper">
                <h3>{this.state.ammountComments} kommentarer</h3>
              </div>
              <div className="post-comment-wrapper">
                <ThemeProvider theme={theme}>
                  <TextField
                    onFocus={this.removeEvents}
                    onBlur={this.addEvents}
                    className="comment-field"
                    id="new-comment"
                    multiline
                    label="Lägg till en ny kommentar"
                    value={this.state.newCommentValue}
                    onChange={(e) => {
                      this.setState({ newCommentValue: e.target.value });
                    }}
                  ></TextField>
                </ThemeProvider>
                <Button
                  onClick={this.handleComments}
                  className="comment-submit"
                  disabled={/^\s*$/.test(this.state.newCommentValue)}
                >
                  Kommentera
                </Button>
              </div>
              {this.state.comments ? (
                <div id="posted-comments" className="posted-comments">
                  {this.state.comments.map((comment, i) => (
                    <CommentBox
                      key={i}
                      comment={comment}
                      videoDetails={this.state.videoDetails}
                      username={this.state.username}
                      updateComments={this.updateComments}
                      removeComment={this.removeComment}
                      addEvents={this.addEvents}
                      removeEvents={this.removeEvents}
                    />
                  ))}
                </div>
              ) : (
                <div className="loading-comments">
                  <ThemeProvider theme={theme}>
                    <CircularProgress />
                  </ThemeProvider>
                </div>
              )}
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
    this.elemRef = React.createRef();
    this.state = {
      replies: null,
      ammountReplies: 0,
      isEdited: false,
      likeColor: "#909090",
      dislikeColor: "#909090",
      liked: false,
      disliked: false,
      likes: 0,
      dislikes: 0,
      nextToken: "",
      openBox: false,
      moreReplies: false,
      editable: false,
      showOptions: false,
      offset: 0,
      replyFieldOpen: false,
      newReplyValue: "",
      img: "",
    };
    this._isMounted = false;
  }
  componentDidMount = async () => {
    this._isMounted = true;
    console.log(this.props.comment);
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
      newCommentValue: this.props.comment.comment,
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
    await this.getProfileImg(this.props.comment.username);
  };
  getProfileImg = async (username) => {
    const image = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    this.setState({ img: image });
  };
  handleReplies = async () => {
    console.log(this.props.username);
    if (/^\s*$/.test(this.state.newReplyValue)) {
    } else {
      let reply = await API.graphql(
        graphqlOperation(mutations.addReply, {
          input: {
            videoID: this.props.comment.videoID,
            username: this.props.username,
            comment: escape(this.state.newReplyValue),
            commentID: this.props.comment.id,
          },
        })
      ).then((res) => {
        return res.data.addReply;
      });
      if (this.state.replies) {
        this.setState((prevState) => ({
          replies: [...prevState.replies, reply],
          ammountReplies: this.state.ammountReplies + 1,
          newReplyValue: "",
        }));
      } else {
        this.setState({
          ammountReplies: this.state.ammountReplies + 1,
          newReplyValue: "",
          replyFieldOpen: false,
        });
      }
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
        likes: 0,
        dislikes: 0,
        nextToken: "",
        openBox: false,
        moreReplies: false,
        editable: false,
        showOptions: false,
        offset: 0,
        replyFieldOpen: false,
        newCommentValue: "",
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
    if (/^\s*$/.test(this.state.newCommentValue)) {
    } else {
      let editedComment = await API.graphql(
        graphqlOperation(mutations.editComment, {
          input: {
            id: this.props.comment.id,
            comment: escape(this.state.newCommentValue),
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
    if (!this.state.replies) {
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
              <Link
                className="username-link"
                to={`/home/users/${this.props.comment.username}`}
              >
                <Avatar
                  style={{ marginRight: "0.25em" }}
                  width={50}
                  height={50}
                  src={this.state.img}
                />
                {this.props.comment.username}
              </Link>{" "}
              <TimeAgo
                className="time-ago"
                date={this.props.comment.createdAt}
                formatter={formatter}
              />
              {" " + (this.state.isEdited === true ? "(redigerat)" : "")}
            </div>
            <div className="comment">
              <MDReactComponent text={unescape(this.props.comment.comment)} />
            </div>
            <div className="comment-likes">
              <ButtonBase
                className="likes-dislikes-buttons"
                id="reply-like-button"
                style={{ padding: "10px 0" }}
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
              </ButtonBase>
              <ButtonBase
                style={{ padding: "10px 0" }}
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
              </ButtonBase>
              <ButtonBase
                style={{ padding: "10px 0" }}
                onClick={() => this.handleReplyField()}
                className="likes-dislikes-buttons"
                id="reply-answer-button"
              >
                <b>Svara</b>
              </ButtonBase>
              {this.props.comment.username === this.props.username && (
                <ButtonBase
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
                </ButtonBase>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-comment-field">
            <ThemeProvider theme={theme}>
              <TextField
                onFocus={this.props.removeEvents}
                onBlur={this.props.addEvents}
                className="comment-field"
                id="new-comment"
                multiline
                label="Redigera kommentaren"
                value={unescape(this.state.newCommentValue)}
                onChange={(e) => {
                  this.setState({ newCommentValue: e.target.value });
                }}
              ></TextField>
            </ThemeProvider>
            <Button
              onClick={this.saveEdit}
              className="comment-submit"
              disabled={/^\s*$/.test(this.state.newCommentValue)}
            >
              Spara
            </Button>
            <Button
              onClick={() => this.setState({ editable: false })}
              className="comment-submit"
            >
              Avbryt
            </Button>
          </div>
        )}
        {this.state.replyFieldOpen === true && (
          <div className="reply-field-container">
            <ThemeProvider theme={theme}>
              <TextField
                onFocus={this.props.removeEvents}
                onBlur={this.props.addEvents}
                className="comment-field"
                id="new-comment"
                multiline
                label="Lägg till en ny kommentar"
                value={this.state.newReplyValue}
                onChange={(e) => {
                  this.setState({ newReplyValue: e.target.value });
                }}
              ></TextField>
            </ThemeProvider>
            <Button
              onClick={this.handleReplies}
              className="comment-submit"
              id="post-comment"
              disabled={/^\s*$/.test(this.state.newReplyValue)}
            >
              Svara
            </Button>
          </div>
        )}
        {this.state.ammountReplies > 0 && (
          <div className="ammount-replies">
            {this.state.openBox === false ? (
              <ButtonBase onClick={this.openReplies} className="view-replies">
                <ArrowDropDown />
                {` Visa ${this.state.ammountReplies} svar`}
              </ButtonBase>
            ) : (
              <ButtonBase onClick={this.openReplies} className="view-replies">
                <ArrowDropUp />
                {` Dölj svar`}
              </ButtonBase>
            )}
          </div>
        )}
        {this.state.openBox === true && (
          <div className="replies-container">
            {this.state.replies ? (
              this.state.replies.map((reply, i) => (
                <ReplyBox
                  key={i}
                  reply={reply}
                  username={this.props.username}
                  removeEvents={this.props.removeEvents}
                  addEvents={this.props.addEvents}
                  updateReplies={this.updateReplies}
                  removeReply={this.removeReply}
                />
              ))
            ) : (
              <div className="loading-comments">
                <ThemeProvider theme={theme}>
                  <CircularProgress />
                </ThemeProvider>
              </div>
            )}
            {this.state.moreReplies == true && (
              <ButtonBase
                onClick={this.loadMoreReplies}
                className="view-replies"
              >
                {`Visa fler svar`}
              </ButtonBase>
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
      newReplyValue: "",
      img: "",
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    this.setState({ newReplyValue: this.props.reply.comment });
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
    await this.getProfileImg(this.props.reply.username);
  }
  getProfileImg = async (username) => {
    const image = await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    this.setState({ img: image });
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
  editReply = () => {
    if (isMobile) {
      this.closeMoreOptions();
    }
    this.setState({
      editable: true,
    });
  };
  saveEdit = async (e) => {
    if (/^\s*$/.test(this.state.newReplyValue)) {
    } else {
      let editedReply = await API.graphql(
        graphqlOperation(mutations.editReply, {
          input: {
            id: this.props.reply.id,
            comment: escape(this.state.newReplyValue),
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
      .catch((err) => {});
  };
  isMobile = () => {
    if (
      window.matchMedia("(max-width: 813px)").matches ||
      window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
        .matches
    ) {
      return true;
    } else {
      return false;
    }
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
              <Link
                className="username-link"
                to={`/home/users/${this.props.reply.username}`}
              >
                <Avatar
                  style={{ marginRight: "0.25em" }}
                  width={50}
                  height={50}
                  src={this.state.img}
                />
                {this.props.reply.username}
              </Link>{" "}
              <TimeAgo
                className="time-ago"
                date={this.props.reply.createdAt}
                formatter={formatter}
              />
              {" " + (this.state.isEdited === true ? "(redigerat)" : "")}
            </div>
            <div className="reply">
              <MDReactComponent text={unescape(this.props.reply.comment)} />
            </div>
            <div className="comment-likes">
              <ButtonBase
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
              </ButtonBase>
              <ButtonBase
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
              </ButtonBase>
              {this.props.reply.username === this.props.username && (
                <ButtonBase
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
                </ButtonBase>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-comment-field">
            <ThemeProvider theme={theme}>
              <TextField
                onFocus={this.props.removeEvents}
                onBlur={this.props.addEvents}
                className="comment-field"
                id="new-comment"
                multiline
                label="Redigera kommentaren"
                value={unescape(this.state.newReplyValue)}
                onChange={(e) => {
                  this.setState({ newReplyValue: e.target.value });
                }}
              ></TextField>
            </ThemeProvider>
            <Button
              onClick={this.saveEdit}
              className="comment-submit"
              disabled={/^\s*$/.test(this.state.newReplyValue)}
            >
              Spara
            </Button>
            <Button
              onClick={() => this.setState({ editable: false })}
              className="comment-submit"
            >
              Avbryt
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Watch);
