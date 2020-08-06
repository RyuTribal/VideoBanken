import React from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../../img/hermes-logo.svg";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
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
  Drawer,
  ButtonBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Slide,
  useScrollTrigger,
  Avatar,
  InputBase,
} from "@material-ui/core";
import { Skeleton, Autocomplete } from "@material-ui/lab";
import { withStyles, fade } from "@material-ui/core/styles";
import theme from "../../../theme";
import grey from "@material-ui/core/colors/grey";
import {
  Menu,
  Inbox,
  VideoCall,
  VideoLabel,
  Group,
  Search,
  ExitToApp,
} from "@material-ui/icons";
const videoSuggestions = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
];
const drawerWidth = 255;
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  appbar: {
    backgroundColor: "#F7F8FC",
    color: "black",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    "@media (max-width: 813px)": {
      width: "100%",
      marginLeft: 0,
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      width: "100%",
      marginLeft: 0,
    },
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    "@media (max-width: 813px)": {
      width: "initial",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      width: "initial",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: "none",
    "@media (max-width: 813px)": {
      display: "block",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "block",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#263040",
    overflowX: "hidden",
    overflowY: "auto",
    color: "#fbf9f9",
    textTransform: "uppercase",
  },
  listIcon: {
    color: "#fbf9f9",
  },
  titleContainer: {
    opacity: "0.7",
    "&:hover": {
      opacity: 1,
    },
  },
  activeTitle: {
    color: "#ea3a3a",
    opacity: 1,
    backgroundColor: "#1e2633",
  },
  activeIcon: {
    color: "#ea3a3a",
    opacity: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    ":hover": {
      textDecoration: "none",
      color: "inherit",
    },
    ":focus": {
      textDecoration: "none",
      color: "inherit",
    },
  },
  profileWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(3),
    color: "inherit",
    textDecoration: "none",
    textTransform: "none",
  },
  username: {
    color: "#666666",
    fontSize: 11,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(grey[500], 0.15),
    "&:hover": {
      backgroundColor: fade(grey[500], 0.25),
    },
    borderColor: grey[300],
    border: "1px solid",
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      // marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
});
class SidebarComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      profileImg: "",
      loading: true,
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.state.user !== this.props.state.user) {
      this.setState({ loading: true });
      this.getProfileImg();
    }
  };
  onItemClicked = (item) => {
    this.setState({ expanded: false });
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
  getProfileImg = async () => {
    console.log("here");
    if (this.props.state.user) {
      await Storage.vault
        .get(`profilePhoto.jpg`, {
          bucket: "user-images-hermes",
          level: "public",
          customPrefix: {
            public: `${this.props.state.user.username}/`,
          },
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        })
        .then((res) => {
          console.log(res);
          this.setState({ profileImg: res, loading: false });
        });
    }
  };
  render() {
    const { classes } = this.props;
    const drawer = (
      <div className={classes.drawer}>
        <div className={classes.toolbar}>
          {this.state.loading ? (
            <div className={classes.profileWrapper}>
              <Skeleton variant="circle" className={classes.large} />
              <Skeleton width={98} variant="text" />
              <Skeleton width={59} variant="text" />
            </div>
          ) : (
            <Link
              to={`/home/users/${
                this.props.state.user ? this.props.state.user.username : ""
              }`}
              onClick={() => this.setState({ mobileOpen: false })}
              className={classes.profileWrapper}
            >
              <Avatar
                alt="profile-image"
                src={this.state.profileImg}
                className={classes.large}
              />
              <Typography>
                {this.props.state.user ? this.props.state.user.fullName : ""}
              </Typography>
              <Typography className={classes.username}>
                {this.props.state.user
                  ? `@${this.props.state.user.username}`
                  : ""}
              </Typography>
            </Link>
          )}
        </div>

        <Divider />
        <List>
          {[
            { text: "Feed", link: "/home" },
            { text: "Inbox", link: "/home/inbox" },
            { text: "Huddinge P06", link: "/home/team" },
          ].map((item, index) => (
            <Link
              onClick={() => this.setState({ mobileOpen: false })}
              className={classes.link}
              to={item.link}
            >
              <ListItem
                className={
                  this.props.selectedItem === item.text
                    ? classes.activeTitle
                    : classes.titleContainer
                }
                button
                key={item.text}
              >
                <ListItemIcon
                  className={
                    this.props.selectedItem === item.text
                      ? classes.activeIcon
                      : classes.listIcon
                  }
                >
                  {index === 0 && <VideoLabel />}
                  {index === 1 && <Inbox />}
                  {index === 2 && <Group />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          {["Logga ut"].map((text, index) => (
            <ListItem
              onClick={this.props.logout}
              className={
                this.props.selectedItem === text
                  ? classes.activeTitle
                  : classes.titleContainer
              }
              button
              key={text}
            >
              <ListItemIcon
                className={
                  this.props.selectedItem === text
                    ? classes.activeIcon
                    : classes.listIcon
                }
              >
                {index === 0 && <ExitToApp />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
    return (
      <div className={classes.root}>
        <CssBaseline />
        <HideOnScroll {...this.props}>
          <AppBar position="fixed" className={classes.appbar}>
            <Toolbar style={{ width: "100%" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => this.setState({ mobileOpen: true })}
                className={classes.menuButton}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6">{this.props.title}</Typography>
              {!this.isMobile() ? (
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Sök…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
              ) : (
                <IconButton
                  style={{ marginLeft: "auto" }}
                  // onClick={this.props.videoModal}
                  color="inherit"
                >
                  <Search />
                </IconButton>
              )}

              <IconButton
                style={{ marginRight: "0" }}
                onClick={this.props.videoModal}
                color="inherit"
              >
                <VideoCall />
              </IconButton>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {this.isMobile() ? (
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              onClose={() => this.setState({ mobileOpen: false })}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          )}
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: state,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    set_rooms: (rooms) => dispatch({ type: "SET_ROOMS", rooms: rooms }),
    add_room: (room) => dispatch({ type: "ADD_ROOM", room: room }),
    remove_room: (id) => dispatch({ type: "REMOVE_ROOM", id, id }),
    add_subscription: (subscription) =>
      dispatch({ type: "ADD_SUBSCRIPTION", subscription: subscription }),
    remove_subscription: (id) =>
      dispatch({ type: "REMOVE_SUBSCRIPTION", id: id }),
    add_message: (message, settingLast) =>
      dispatch({ type: "ADD_MESSAGE", message: message, settingLast: true }),
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
    add_user: (user) => dispatch({ type: "ADD_USER", user: user }),
    clear_state: () => dispatch({ type: "CLEAR_STATE" }),
    set_notifications: (notifications) =>
      dispatch({ type: "SET_NOTIFICATIONS", notifications: notifications }),
    add_notification: (notification) =>
      dispatch({ type: "ADD_NOTIFICATION", notification: notification }),
    remove_notifications: (id) =>
      dispatch({ type: "REMOVE_NOTIFICATIONS", id: id }),
  };
}
const StyledSideBar = withStyles(useStyles)(SidebarComponent);
export default connect(mapStateToProps, mapDispatchToProps)(StyledSideBar);
