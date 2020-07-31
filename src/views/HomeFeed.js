import React, { Component } from "react";
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
import TimeAgo from "react-timeago";
import swedishStrings from "react-timeago/lib/language-strings/sv";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import {
  Slider,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  AppBar,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Avatar,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import theme from "../theme";
import { Skeleton } from "@material-ui/lab";
const formatter = buildFormatter(swedishStrings);
const useStyles = () => ({
  root: {
    padding: theme.spacing(3),
    width: "100%"
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  username: {
    fontSize: 13,
  },
  videoInfoWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  videoInfoWrapperMobile: {
    display: "flex",
    flexDirection: "row",
  },
  videoInfo: {
    flex: 9,
    paddingLeft: theme.spacing(2),
  },
  cardImage: {
    paddingTop: "56.25%",
    width: "100%",
  },
  cardImageMobile: {
    width: theme.spacing(40),
    paddingTop: "56.25%",
  },
  mobileCard: {
    display: "inline-flex",
    justifyContent: "flex-start",
  },
});

class HomeFeed extends Component {
  constructor() {
    super();
    this.state = { details: [], rows: [], offset: 0, loading: true };
  }
  componentDidMount = async () => {
    let videos = "";
    let rows = [];
    console.log(this.props);
    this.props.onChange("Feed");
    await API.graphql(
      graphqlOperation(queries.getVideos, { offset: this.state.offset })
    ).then(function (result) {
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
    });
    for (let i = 0; i < videos.length; i++) {
      await Storage.vault
        .get("customThumbnail.jpg", {
          bucket: "vod-destination-1uukav97fprkq",
          level: "public",
          customPrefix: { public: `${videos[i].id}/thumbnails/` },
        })
        .then(function (result) {
          videos[i].thumbnail = result;
          if (videos[i].views == null) {
            videos[i].views = "0";
          }

          if (videos[i].title.length > 50) {
            videos[i].title = videos[i].title.substring(0, 47) + "...";
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
        .catch((err) => console.log(err));
      await API.graphql(
        graphqlOperation(queries.getVideoSize, {
          guid: videos[i].id,
        })
      ).then((res) => {
        if (res.data.getVideoSize.workflowStatus !== "Complete") {
          videos.filter((video) => video.id !== videos[i].id);
        }
      });
      videos[i].profileImg = await this.getProfilePhoto(videos[i].username);
    }
    this.setState({ details: videos, rows: rows, loading: false });
  };
  getProfilePhoto = async (username) => {
    let image = await Storage.vault
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
    return image;
  };
  isMobile = () => {
    if (
      window.matchMedia("(orientation: landscape)").matches &&
      (window.matchMedia("(max-width: 813px)").matches ||
        window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
          .matches)
    ) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    const { classes } = this.props;
    console.log(this.state.details);
    const dummyLoad = ["foo", "bar", "foo", "bar"];
    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          {this.state.loading
            ? dummyLoad.map((load, i) => (
                <Grid key={i} item xs={12} sm={12} md={6} lg={4} xl={3}>
                  <Card styles={{ position: "relative" }}>
                    <div className={this.isMobile() ? classes.mobileCard : ""}>
                      <Skeleton
                        variant="rect"
                        className={
                          !this.isMobile()
                            ? classes.cardImage
                            : classes.cardImageMobile
                        }
                      />
                      <CardContent>
                        <div
                          className={
                            !this.isMobile
                              ? classes.videoInfoWrapper
                              : classes.videoInfoWrapperMobile
                          }
                        >
                          {!this.isMobile() && (
                            <Skeleton
                              variant="circle"
                              width={theme.spacing(5)}
                              height={theme.spacing(5)}
                            />
                          )}

                          <div className={classes.videoInfo}>
                            <Skeleton variant="text" width="90%" />
                            <Skeleton variant="text" width="30%" />
                            <Skeleton variant="text" width="90%" />
                          </div>
                        </div>
                        {this.isMobile() && (
                          <Skeleton
                            variant="circle"
                            width={theme.spacing(5)}
                            height={theme.spacing(5)}
                          />
                        )}
                      </CardContent>
                    </div>
                  </Card>
                </Grid>
              ))
            : this.state.details.map((details, i) => (
                <Grid
                  key={i}
                  item
                  xs={12}
                  sm={!this.isMobile() ? 6 : 12}
                  md={6}
                  lg={4}
                  xl={3}
                >
                  <Card styles={{ position: "relative" }} title={details.title}>
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        backgroundColor: "inherit",
                      }}
                      to={`/home/watch/${details.id}`}
                    >
                      <CardActionArea
                        className={this.isMobile() ? classes.mobileCard : ""}
                      >
                        <CardMedia
                          // component="img"
                          alt="Contemplative Reptile"
                          className={
                            !this.isMobile()
                              ? classes.cardImage
                              : classes.cardImageMobile
                          }
                          image={details.thumbnail}
                        />

                        <CardContent>
                          <div
                            className={
                              !this.isMobile
                                ? classes.videoInfoWrapper
                                : classes.videoInfoWrapperMobile
                            }
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                              to={`/home/users/${details.username}`}
                              title={details.username}
                            >
                              {!this.isMobile() && (
                                <Avatar
                                  alt="profile-image"
                                  src={details.profileImg}
                                  title={details.username}
                                />
                              )}
                            </Link>
                            <div className={classes.videoInfo}>
                              <Typography
                                className={classes.title}
                                gutterBottom
                                variant="h5"
                                component="h5"
                              >
                                {details.title}
                              </Typography>
                              <Typography
                                display="block"
                                variant="caption"
                                color="textSecondary"
                              >
                                <Link
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                  to={`/home/users/${details.username}`}
                                  title={details.username}
                                >
                                  {details.username}
                                </Link>
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {`${details.views} visningar • `}
                                <TimeAgo
                                  date={details.createdAt}
                                  formatter={formatter}
                                />
                              </Typography>
                            </div>
                          </div>
                          {this.isMobile() && (
                            <Avatar
                              style={{ marginLeft: theme.spacing(2) }}
                              alt="profile-image"
                              src={details.profileImg}
                              title={details.username}
                            />
                          )}
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(useStyles)(HomeFeed));
