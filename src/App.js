import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth, Hub } from "aws-amplify";
import config from "./awsconfig/config";
import awsExports from "./aws-exports";
import { paths } from "./awsconfig/paths";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";
import AuthView from "./components/AuthView";
import { connect } from "react-redux";
import { set_user, set_profile_img } from "./redux/actions/index";
import appStartUp from "./redundant_functions/appStartUp";
import UnAuthView from "./components/UnAuthView";
Amplify.configure(awsExports);
Amplify.configure(config);
Auth.configure();
function mapDispatchToProps(dispatch) {
  return {
    set_user: (user) => dispatch(set_user(user)),
    set_profile_img: (img) => dispatch(set_profile_img(img)),
  };
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      userExists: true,
    };
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          this.props.history.push("/home");
          this.setState({ authenticated: true });
          break;
        case "signOut":
          this.props.history.push("/login");
          this.setState({ authenticated: false });
          break;
        case "signUp":
          this.props.history.push("/login");
          break;
        default:
          console.log(data.payload.event);
      }
    });
  }
  componentDidMount = async () => {
    await Auth.currentAuthenticatedUser()
      .then(() => {
        for (let i = 0; i < paths.length; i++) {
          console.log(paths[i])
          if (
            this.props.location.pathname === paths[i].path &&
            !paths[i].isAuthenticated
          ) {
            this.props.history.push("/home");
          }
        }
        this.setState({ authenticated: true });
      })
      .catch(() => {
        for (let i = 0; i < paths.length; i++) {
          if (
            this.props.location.pathname === paths[i].path &&
            paths[i].isAuthenticated
          ) {
            this.props.history.push("/login");
          }
        }
      });
  };
  componentDidUpdate = async (prevProps, prevState) => {
    if (!prevState.authenticated && this.state.authenticated) {
      const userExists = await appStartUp(this.props);
      if (!userExists) {
        this.setState({ userExists });
      }
    } else if (prevState.authenticated && !this.state.authenticated) {
      // appShutDown();
    }
  };
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {this.state.authenticated ? (
          <AuthView userExists={this.state.userExists} />
        ) : (
          <UnAuthView />
        )}
      </ThemeProvider>
    );
  }
}

const Application = connect(null, mapDispatchToProps)(App);

export default withRouter(Application);
