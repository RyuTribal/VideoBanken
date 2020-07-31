import React, { Component } from "react";
import { string } from "prop-types";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import blankProfile from "../../../img/blank-profile.png";
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
} from "@material-ui/core";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { VideoCall } from "@material-ui/icons";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginLeft: 14,
    border: "1px solid #bf9c96",
  },
  container: {
    height: 40,
    padding: 30,
    paddingTop: 30,
    color: "#263040",
    zIndex: 4,
  },
  cursorPointer: {
    cursor: "pointer",
  },
  name: {
    fontFamily: "",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "20px",
    textAlign: "right",
    letterSpacing: 0.2,
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  separator: {
    borderLeft: "1px solid #bf9c96",
    marginLeft: 32,
    marginRight: 32,
    height: 32,
    width: 2,
    "@media (max-width: 321px)": {
      marginLeft: 15,
      marginRight: 10,
    },
  },
  title: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "30px",
    letterSpacing: 0.3,
    "@media (max-width: 768px)": {
      marginLeft: 36,
    },
    "@media (max-width: 468px)": {
      fontSize: 20,
    },
  },
  iconStyles: {
    cursor: "pointer",
    marginLeft: 25,
    "@media (max-width: 768px)": {
      marginLeft: 12,
    },
  },
  link: {
    color: "#263040",
    ":hover": {
      textDecoration: "none",
      color: "#263040",
    },
  },
});
const useStyles = (theme) => ({
  input: {
    width: "100%",
  },
  appbar: {
    backgroundColor: "transparent",
    position: "relative",
    color: "black",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#263040",
    },
  },
});
class HeaderComponent extends Component {
  constructor() {
    super();
    this.state = {
      profileImg: "",
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.profileImg !== this.props.profileImg) {
      this.setState({ profileImg: this.props.profileImg });
    }
  };
  getProfileImage = async () => {
    await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${this.props.username}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        this.setState({ profileImg: res });
      })
      .catch(() => {
        this.setState({ profileImg: blankProfile });
      });
  };
  onItemClick = (item) => {
    return this.props.onChange(item);
  };
  render() {
    console.log(this.state.profileImg);
    const { classes } = this.props;
    return (
      // <Row
      //   className={css(styles.container)}
      //   vertical="center"
      //   horizontal="space-between"
      // >
      //   <span className={css(styles.title)}>{this.props.title}</span>
      //   <Row vertical="center">
      //     <div className={css(styles.iconStyles)}>
      //       <i className="fas fa-search"></i>
      //     </div>
      //     {/* <div className={css(styles.iconStyles)}>
      //       <i className="fas fa-bell"></i>
      //     </div> */}
      //     <div
      //       onClick={this.props.videoModal}
      //       className={css(styles.iconStyles)}
      //     >
      //       <i className="fas fa-video"></i>
      //     </div>
      //     <div className={css(styles.separator)}></div>
      //     <Row
      //       active={this.props.selectedItem === "Profil"}
      //       onClick={() => this.onItemClick("Profil")}
      //       vertical="center"
      //     >
      //       <Link
      //         className={css(styles.link)}
      //         to={`/home/users/${this.props.username}`}
      //       >
      //         <span className={css(styles.name, styles.cursorPointer)}>
      //           {this.props.usernickname}
      //         </span>
      //         <img
      //           onError={() => this.getProfileImage()}
      //           src={this.state.profileImg}
      //           className={css(styles.avatar)}
      //         />
      //       </Link>
      //     </Row>
      //   </Row>
      // </Row>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6">{this.props.title}</Typography>
          <IconButton onClick={this.props.videoModal} color="inherit">
            <VideoCall />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(useStyles)(HeaderComponent));
