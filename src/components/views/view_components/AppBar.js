import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { makeStyles, fade } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import isMobile from "../../../redundant_functions/isMobile";

const styles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: "#F7F8FC",
    color: "black",
    width: `calc(100% - ${255}px)`,
    marginLeft: 255,
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
  items: {
    marginLeft: theme.spacing(2),
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
}));

function renderItem(item, i, props, pos, classes) {
  if (item.type === "icon") {
    const Icon = Icons[item.icon];
    return (
      <IconButton className={classes.items} key={i} edge={pos} color="inherit">
        <Icon />
      </IconButton>
    );
  }
}

export default function AppBarComponent(props) {
  const classes = styles();
  return (
    <AppBar position={props.position} className={classes.appbar}>
      <Toolbar style={{ width: "100%" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={classes.menuButton}
          onClick={props.toggleMenu}
        >
          <Icons.Menu />
        </IconButton>
        {props.title && <Typography variant="h6">{props.titleText}</Typography>}
        {props.leftItems &&
          props.leftItems.map((item, i) =>
            renderItem(item, i, props, "start", classes)
          )}
        {!isMobile() && props.searchbar ? (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Icons.Search />
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
          ""
        )}
        {isMobile() && props.searchbar ? (
          <IconButton style={{ marginLeft: "auto" }} color="inherit">
            <Icons.Search />
          </IconButton>
        ) : (
          ""
        )}
        {props.rightItems &&
          props.rightItems.map((item, i) =>
            renderItem(item, i, props, "end", classes)
          )}
      </Toolbar>
    </AppBar>
  );
}
