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
  ThemeProvider,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import theme from "../../../theme";
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
    textDecoration: "none",
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
  videoTitle: {
    textAlign: "start",
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
    cursor: "pointer",
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
  errorWorkFlow: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: "20",
  },
  loading: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});
const useStyles = () => ({
  root: {
    padding: theme.spacing(3),
    width: "100%",
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
  cardImageSkeleton: {
    paddingTop: "56.25%",
    width: "100%",
  },
  cardImageMobileSkeleton: {
    width: theme.spacing(40),
    paddingTop: "56.25%",
  },
  mobileCard: {
    display: "inline-flex",
    justifyContent: "flex-start",
  },
  grid: {
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
});
class Posts extends Component {
  constructor() {
    super();
    this.state = {
      offset: 0,
      uploads: [],
      loading: true,
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
        if (res.data.getVideoSize) {
          userUploads[i].status = res.data.getVideoSize.workflowStatus;
        }
      });
    }
    console.log(userUploads);
    this.setState({ uploads: userUploads, loading: false });
  };
  componentDidUpdate = async (prevProps) => {};
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
    return (
      <div className={css(styles.container)}>
        {this.state.loading ? (
          <div className={css(styles.loading)}>
            <ThemeProvider theme={theme}>
              <CircularProgress />
            </ThemeProvider>
          </div>
        ) : (
          <Grid container style={{ marginTop: 10 }}>
            {this.state.uploads.map((details, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={!this.isMobile() ? 6 : 12}
                md={6}
                lg={4}
                xl={3}
                className={classes.grid}
              >
                {details.status === "Complete" ? (
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
                            ></Link>
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
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                ) : (
                  <Card styles={{ position: "relative" }} title={details.title}>
                    <div
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        backgroundColor: "inherit",
                      }}
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
                          image={graySolid}
                        />

                        <CardContent>
                          <div
                            className={
                              !this.isMobile
                                ? classes.videoInfoWrapper
                                : classes.videoInfoWrapperMobile
                            }
                          >
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
                                {details.status === "Error" ? (
                                  <div className={css(styles.errorWorkFlow)}>
                                    Något fel upstod i videotranskodningen!
                                  </div>
                                ) : (
                                  <div className={css(styles.workFlowStatus)}>
                                    Videon bearbetas...
                                  </div>
                                )}
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
                        </CardContent>
                      </CardActionArea>
                    </div>
                  </Card>
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(Posts);
