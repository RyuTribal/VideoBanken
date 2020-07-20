import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import graySolid from "../../../img/graySolid.jpg";
const formatter = buildFormatter(swedishStrings);
const blinkKeyFrom = {
  from: { opacity: 0 },
  to: { opactiy: 1 },
};
const blinkKeyTo = {
  from: { opacity: 1 },
  to: { opactiy: 0 },
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  uploadWrapper: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  videoPreview: {
    maxHeight: 200,
    width: "100%",
    color: "#263040",
    display: "flex",
    ":hover": {
      textDecoration: "none",
    },
    ":focus": {
      textDecoration: "none",
    },
    zIndex: 1,
    overflow: "hidden",
  },
  videoDetails: {
    marginLeft: 20,
  },
  videoThumbnail: {
    width: "33%",
    height: 0,
    paddingBottom: "56.25%",
    overflow: "hidden",
    zIndex: -1,
    cursor: "default",
  },
  thumbnail: {
    width: "100%",
    background: "#efefef",
  },
  dateUsernameWrap: {
    color: "#606060",
  },
  videoUsername: {
    color: "#606060",
  },
  uploadError: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#666666",
    marginTop: 20,
  },
  workFlowStatus: {
    color: "rgb(102, 102, 102)",
    fontWeight: "bold",
    fontSize: "20",
    animationName: [blinkKeyFrom, blinkKeyTo],
    animationDuration: "1s",
    animationIterationCount: "infinite",
  },
});
class Posts extends Component {
  constructor() {
    super();
    this.state = {
      offset: 0,
      uploads: [],
    };
  }
  componentDidMount = async () => {
    let userUploads = await API.graphql(
      graphqlOperation(queries.getUserUploads, {
        username: this.props.username,
        offset: 0,
      })
    ).then((res) => {
      this.setState({ offset: this.state.offset + 20 });
      return res.data.getUserUploads;
    });
    for (let i = 0; i < userUploads.length; i++) {
      await Storage.vault
        .get("customThumbnail.jpg", {
          bucket: "vod-destination-1uukav97fprkq",
          level: "public",
          customPrefix: { public: `${userUploads[i].id}/thumbnails/` },
        })
        .then(function (result) {
          userUploads[i].thumbnail = result;
          if (userUploads[i].views == null) {
            userUploads[i].views = "0";
          }

          if (userUploads[i].title.length > 50) {
            userUploads[i].title =
              userUploads[i].title.substring(0, 47) + "...";
          }
          const ammountViews = JSON.parse(userUploads[i].views);
          console.log(ammountViews);
          if (ammountViews >= 1000 && ammountViews < 1000000) {
            userUploads[i].views = Math.round(ammountViews / 1000) + "tn";
          } else if (ammountViews >= 1000000 && ammountViews < 1000000000) {
            userUploads[i].views = Math.round(ammountViews / 1000000) + "mn";
          } else if (ammountViews >= 1000000000) {
            userUploads[i].views = Math.round(ammountViews / 1000000000) + "md";
          } else if (ammountViews == null) {
            userUploads[i].views = 0;
          } else {
            userUploads[i].views = ammountViews;
          }
        });
      await API.graphql(
        graphqlOperation(queries.getVideoSize, {
          guid: userUploads[i].id,
        })
      ).then((res) => {
        console.log(res);
        userUploads[i].status = res.data.getVideoSize.workflowStatus;
      });
    }
    console.log(userUploads);
    this.setState({ uploads: userUploads });
  };
  componentDidUpdate = async (prevProps) => {};
  render() {
    return (
      <div className={css(styles.container)}>
        {this.state.uploads.length < 1 ? (
          <div className={css(styles.uploadError)}>
            Denna profil har inga uppladningar
          </div>
        ) : (
          <div className={css(styles.uploadWrapper)}>
            {this.state.uploads.map((upload, i) => (
              <div>
                {upload.status === "Complete" ? (
                  <Link
                    to={`/home/watch/${upload.id}`}
                    key={i}
                    className={css(styles.videoPreview)}
                  >
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={css(styles.videoThumbnail)}
                    >
                      <img
                        className={css(styles.thumbnail)}
                        src={upload.thumbnail}
                      />
                    </div>
                    <div className={css(styles.videoDetails)}>
                      <div className={css(styles.videoTitleWrap)}>
                        <h3 className={css(styles.videoTitle)}>
                          {upload.title}
                        </h3>
                      </div>
                      <div className={css(styles.dateUsernameWrap)}>
                        <p className={css(styles.likesDates)}>
                          {`${upload.views} visningar `}
                          <span className={css(styles.bulletElements)}>
                            &#x25cf;
                          </span>
                          {` `}
                          <TimeAgo
                            className={css(styles.timeAgo)}
                            date={upload.createdAt}
                            formatter={formatter}
                          />
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div key={i} className={css(styles.videoPreview)}>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={css(styles.videoThumbnail)}
                    >
                      <img src={graySolid} className={css(styles.thumbnail)} />
                    </div>
                    <div className={css(styles.videoDetails)}>
                      <div className={css(styles.videoTitleWrap)}>
                        <h3 className={css(styles.videoTitle)}>
                          {upload.title}
                        </h3>
                      </div>
                      <div className={css(styles.dateUsernameWrap)}>
                        <div className={css(styles.workFlowStatus)}>
                          Videon bearbetas...
                        </div>
                        <p className={css(styles.likesDates)}>
                          {`${upload.views} visningar `}
                          <span className={css(styles.bulletElements)}>
                            &#x25cf;
                          </span>
                          {` `}
                          <TimeAgo
                            className={css(styles.timeAgo)}
                            date={upload.createdAt}
                            formatter={formatter}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Posts;
