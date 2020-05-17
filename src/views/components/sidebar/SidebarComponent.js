import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import LogoComponent from "./LogoComponent";
import MenuItemsComponent from "./MenuItemsComponent";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#263040",
    minWidth: 255,
    paddingTop: 32,
    height: "100vh !important",
    overflowY: "auto",
  },
  menuItemList: {
    marginTop: 52,
  },
  separator: {
    borderTop: "1px solid #FFF",
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06,
  },
  burgerIcon: {
    cursor: "pointer",
    position: "absolute",
    left: 24,
    top: 17,
    fontSize: 20,
  },
  containerMobile: {
    transition: "left 0.5s, right 0.5s",
    position: "absolute",
    width: 255,
    height: "100vh",
    zIndex: 901,
  },
  mainContainer: {
    height: "100%",
    minHeight: "100vh",
  },
  mainContainerMobile: {
    position: "absolute",
    width: "100vw",
    minWidth: "100%",
    height: "calc(100% - 32px)",
    top: 0,
    left: 0,
  },
  outsideLayer: {
    position: "absolute",
    width: "100vw",
    minWidth: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.50)",
    zIndex: 900,
  },
  hide: {
    left: -255,
  },
  show: {
    left: 0,
  },
  logout: {
    height: 56,
    cursor: "pointer",
    ":hover i": {
      opacity: "1",
    },
    ":hover span": {
      opacity: "1",
    },
    paddingLeft: 32,
    paddingRight: 32,
  },
  logoutTitle: {
    fontSize: 16,
    lineHeight: "20px",
    letterSpacing: "0.2px",
    color: "#fbf9f9",
    opacity: "0.7",
    marginLeft: 24,
    transition: "0.4s",
    textTransform: "uppercase",
  },
  logoutIcon: {
    color: "#fbf9f9",
    opacity: "0.7",
    transition: "0.4s",
  },
});

class SidebarComponent extends React.Component {
  state = { expanded: false };

  onItemClicked = (item) => {
    this.setState({ expanded: false });
  };

  isMobile = () => window.innerWidth <= 768;

  toggleMenu = () =>
    this.setState((prevState) => ({ expanded: !prevState.expanded }));

  renderBurger = () => {
    return (
      <div onClick={this.toggleMenu} className={css(styles.burgerIcon)}>
        <i className="fas fa-bars"></i>
      </div>
    );
  };

  render() {
    const { expanded } = this.state;
    const isMobile = this.props.isMobile;
    return (
      <div style={{ position: "relative" }}>
        <Row
          className={css(styles.mainContainer)}
          breakpoints={{ 768: css(styles.mainContainerMobile) }}
        >
          {isMobile && !expanded && this.renderBurger()}
          <Column
            className={css(styles.container)}
            breakpoints={{
              768: css(
                styles.containerMobile,
                expanded ? styles.show : styles.hide
              ),
            }}
          >
            <LogoComponent />
            <Column className={css(styles.menuItemList)}>
              <MenuItemsComponent
                title="Feed"
                icon="fas fa-tv"
                onClick={() => this.onItemClicked("Feed")}
                active={this.props.selectedItem === "Feed"}
                link="/home/"
              />
              <div className={css(styles.separator)}></div>
              <MenuItemsComponent
                title="Profil"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Profil")}
                active={this.props.selectedItem === "Profil"}
                link={`/home/users/${this.props.username}`}
              />
              {/* <MenuItemsComponent
                title="Tickets"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Tickets")}
                active={this.props.selectedItem === "Tickets"}
              />
              <MenuItemsComponent
                title="Ideas"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Ideas")}
                active={this.props.selectedItem === "Ideas"}
              />
              <MenuItemsComponent
                title="Contacts"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Contacts")}
                active={this.props.selectedItem === "Contacts"}
              />
              <MenuItemsComponent
                title="Agents"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Agents")}
                active={this.props.selectedItem === "Agents"}
              />
              <MenuItemsComponent
                title="Articles"
                icon="fas fa-user"
                onClick={() => this.onItemClicked("Articles")}
                active={this.props.selectedItem === "Articles"}
              /> */}
              <Row
                onClick={this.props.logout}
                className={css(styles.logout)}
                vertical="center"
              >
                <i
                  className={`${css(styles.logoutIcon)} fas fa-sign-out-alt`}
                ></i>
                <span className={css(styles.logoutTitle)}>Logga ut</span>
              </Row>
            </Column>
          </Column>
          {isMobile && expanded && (
            <div
              className={css(styles.outsideLayer)}
              onClick={this.toggleMenu}
            ></div>
          )}
        </Row>
      </div>
    );
  }
}

export default SidebarComponent;
