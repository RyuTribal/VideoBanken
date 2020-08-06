import React, { Component } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  ButtonBase,
  Avatar,
  DialogTitle,
  Toolbar,
  AppBar,
  Typography,
} from "@material-ui/core";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import theme from "../../../theme";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import { withRouter } from "react-router-dom";
const useStyles = (theme) => ({
  input: {
    width: "100%",
  },
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  followersWrapper: {
    minHeight: 650,
    padding: 0,
  },
  button: {
    width: "100%",
  },
  messageBox: {
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    cursor: "pointer",
    transition: "0.2s",
    ":hover": {
      background: "white",
      transition: "0.2s",
    },
    position: "relative",
  },
  image: {
    width: 50,
    height: "100%",
    borderRadius: "50%",
  },
  nameMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  user: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "normal",
  },
});
class Followers extends Component {
  constructor() {
    super();
    this.state = {
      followers: [],
    };
  }
  componentDidMount = async () => {
    if (!this.props.followerProps.followerVer) {
      let followers = await API.graphql(
        graphqlOperation(queries.getFollowers, {
          username: this.props.followerProps.userInfo.username,
        })
      ).then((res) => {
        return res.data.getFollowers;
      });
      this.setState({ followers });
      this.props.set_followers(followers.length);
    } else {
      let followers = await API.graphql(
        graphqlOperation(queries.getFollows, {
          follows: this.props.followerProps.userInfo.username,
        })
      ).then((res) => {
        console.log(res);
        return res.data.getFollows;
      });
      this.setState({ followers: followers });
      this.props.set_follows(followers.length);
    }
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
  redirectToUser = (username) => {
    this.props.closeModal();
    this.props.history.push(`/home/users/${username}`);
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Dialog
          open={true}
          fullWidth={true}
          //   maxWidth={true}
          onClose={() => this.props.closeModal()}
          aria-labelledby="form-dialog-title"
          fullScreen={this.isMobile()}
        >
          {this.isMobile() ? (
            <AppBar className={classes.appbar} id="form-dialog-title">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={this.props.closeModal}
                >
                  <Close />
                </IconButton>
                <Typography className={classes.title} variant="h6">
                  {this.props.followerProps.followerVer
                    ? `${this.state.followers.length} konto följer ${this.props.followerProps.userInfo.username}`
                    : `${this.props.followerProps.userInfo.username} följer ${this.state.followers.length} konto`}
                </Typography>
              </Toolbar>
            </AppBar>
          ) : (
            <DialogTitle>
              {this.props.followerProps.followerVer
                ? `${this.state.followers.length} konto följer ${this.props.followerProps.userInfo.username}`
                : `${this.props.followerProps.userInfo.username} följer ${this.state.followers.length} konto`}
            </DialogTitle>
          )}

          <DialogContent>
            <div className={classes.followersWrapper}>
              {this.state.followers.map((follower, i) => (
                <FollowerBox
                  key={i}
                  follower={follower}
                  classes={classes}
                  followVer={this.props.followerProps.followerVer}
                  redirect={() =>
                    this.redirectToUser(
                      this.props.followerProps.followerVer
                        ? follower.username
                        : follower.follows
                    )
                  }
                />
              ))}
            </div>
          </DialogContent>
          {!this.isMobile() && (
            <DialogActions>
              <Button
                color="inherit"
                onClick={() => {
                  this.props.closeModal();
                }}
              >
                Stäng
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
}

class FollowerBox extends Component {
  constructor() {
    super();
    this.state = {
      follows: false,
      img: null,
      userInfo: {},
    };
  }
  componentDidMount = async () => {
    await API.graphql(
      graphqlOperation(queries.getUser, {
        username: this.props.followVer
          ? this.props.follower.username
          : this.props.follower.follows,
      })
    ).then((res) => {
      this.setState({ userInfo: res.data.getUser });
    });
    const img = await this.getProfilePhoto(this.state.userInfo.username);
    this.setState({ img: img });
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
  render() {
    return (
      <ButtonBase
        onClick={this.props.redirect}
        className={this.props.classes.button}
      >
        <div className={this.props.classes.messageBox}>
          {this.state.img ? (
            <Avatar
              src={this.state.img}
              className={this.props.classes.image}
            ></Avatar>
          ) : (
            <Skeleton variant="circle" width={50} height={50} />
          )}

          <div className={this.props.classes.nameMessageWrapper}>
            <div className={this.props.classes.name}>
              {this.state.userInfo.fullName}{" "}
              <span className={this.props.classes.user}>{`@${
                this.props.followVer
                  ? this.props.follower.username
                  : this.props.follower.follows
              }`}</span>
            </div>
          </div>
        </div>
      </ButtonBase>
    );
  }
}

export default withRouter(withStyles(useStyles)(Followers));
