import React from "react";
import HideOnScroll from "./view_components/HideOnScroll";
import DrawerComponent from "./view_components/DrawerComponent";
import AppBar from "./view_components/AppBar";
import { Drawer } from "@material-ui/core";
import theme from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import isMobile from "../../redundant_functions/isMobile";
const styles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
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
  drawerPaper: {
    width: 255,
    backgroundColor: "#263040",
    overflowX: "hidden",
    overflowY: "auto",
    color: "#fbf9f9",
    textTransform: "uppercase",
  },
}));
function Sidebar(props) {
  const classes = styles();
  const items = [
    {
      id: "upload-video",
      type: "icon",
      icon: "VideoCall",
      onClick: () => alert("Video upload"),
    },
  ];
  return (
    <div className={classes.root}>
      <HideOnScroll {...props}>
        <AppBar
          posititon="fixed"
          title
          titleText={props.title}
          searchbar
          rightItems={items}
          toggleMenu={props.toggleMenu}
        />
      </HideOnScroll>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {isMobile() ? (
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={props.openMenu}
            onClose={props.toggleMenu}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <DrawerComponent
              selectedItem={props.selectedItem}
              toggleMenu={props.toggleMenu}
              logout={props.logout}
            />
          </Drawer>
        ) : (
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <DrawerComponent
              selectedItem={props.selectedItem}
              toggleMenu={props.toggleMenu}
              logout={props.logout}
            />
          </Drawer>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
