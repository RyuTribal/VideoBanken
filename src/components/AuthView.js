import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Sidebar from "./views/Sidebar";
import NoUserModal from "./NoUserModal";
import { RenderRoutes } from "../awsconfig/paths";
import { Auth } from "aws-amplify";
const useStyles = (theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
  },
  toolbar: theme.mixins.toolbar,
});
class AuthView extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      selectedItem: "",
      openMenu: false,
      openUserModal: false,
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.userExists !== this.props.userExists) {
      this.setState({ openUserModal: !this.props.userExists });
    }
  };
  logout = () => {
    Auth.signOut();
  };
  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Sidebar
          title={this.state.title}
          selectedItem={this.state.selectedItem}
          toggleMenu={() =>
            this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
          }
          openMenu={this.state.openMenu}
          logout={this.logout}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.state.openUserModal && (
            <NoUserModal
              onClose={() => this.setState({ openUserModal: false })}
            />
          )}
          <RenderRoutes
            setTitle={(title, selectedItem) =>
              this.setState({ title, selectedItem })
            }
          />
        </main>
      </div>
    );
  }
}

export default withStyles(useStyles)(AuthView);
