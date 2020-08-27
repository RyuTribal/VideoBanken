import React from "react";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import LinkStyles from "../../../redundant_styles/Link";
import { paths } from "../../../awsconfig/paths";
import { connect } from "react-redux";
const styles = makeStyles((theme) => ({
  drawer: {
    width: 255,
    flexShrink: 0,
    "@media (max-width: 813px)": {
      width: "initial",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      width: "initial",
    },
  },
  toolbar: theme.mixins.toolbar,

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
    color: theme.palette.secondary.main,
    opacity: 1,
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      color: theme.palette.secondary.main,
      opacity: 1,
      backgroundColor: theme.palette.primary.dark,
    },
  },
  activeIcon: {
    color: theme.palette.secondary.main,
    opacity: 1,
    "&:hover": {
      color: theme.palette.secondary.main,
      opacity: 1,
      backgroundColor: theme.palette.primary.dark,
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
}));
const mapStateToProps = (state) => {
  return { user: state.user };
};
function DrawerComponent(props) {
  const classes = styles();
  const linkClasses = LinkStyles();
  return (
    <Box className={classes.drawer}>
      <Box className={classes.toolbar}>
        {!props.user ? (
          <Box className={classes.profileWrapper}>
            <Skeleton variant="circle" className={classes.large} />
            <Skeleton width={98} variant="text" />
            <Skeleton width={59} variant="text" />
          </Box>
        ) : (
          <Link
            to={`/users/${props.user.username}`}
            className={classes.profileWrapper}
          >
            <Avatar src={props.user.profileImg} className={classes.large} />
            <Typography>{props.user.fullName}</Typography>
            <Typography className={classes.username}>
              {`@${props.user.username}`}
            </Typography>
          </Link>
        )}
      </Box>

      <Divider />
      <List>
        {paths.map((item, i) => {
          const Icon = Icons[item.icon];
          if (item.pos === "top" && item.isAuthenticated && item.onMenu) {
            return (
              <Link
                key={i}
                onClick={props.toggleMenu}
                className={`${linkClasses.noUnderLink} ${linkClasses.inheritLink}`}
                to={item.path}
              >
                <ListItem
                  className={
                    props.selectedItem === item.text
                      ? classes.activeTitle
                      : classes.titleContainer
                  }
                  button
                  key={item.text}
                >
                  <ListItemIcon
                    className={
                      props.selectedItem === item.text
                        ? classes.activeIcon
                        : classes.listIcon
                    }
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            );
          } else {
            return null;
          }
        })}
      </List>
      <Divider />
      <List>
        {paths.map((item, i) => {
          const Icon = Icons[item.icon];
          if (item.pos === "bottom" && item.isAuthenticated && item.onMenu) {
            return (
              <Link
                key={i}
                onClick={props.toggleMenu}
                className={`${linkClasses.noUnderLink} ${linkClasses.inheritLink}`}
                to={item.path}
              >
                <ListItem
                  className={
                    props.selectedItem === item.text
                      ? classes.activeTitle
                      : classes.titleContainer
                  }
                  button
                  key={item.text}
                >
                  <ListItemIcon
                    className={
                      props.selectedItem === item.text
                        ? classes.activeIcon
                        : classes.listIcon
                    }
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            );
          } else {
            return null;
          }
        })}
        <ListItem
          onClick={props.logout}
          className={classes.titleContainer}
          button
          key="Logga ut"
        >
          <ListItemIcon className={classes.listIcon}>
            <Icons.ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logga ut" />
        </ListItem>
      </List>
    </Box>
  );
}
const Drawer = connect(mapStateToProps)(DrawerComponent);

export default Drawer;
