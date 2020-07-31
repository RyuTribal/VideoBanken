import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "intl-tel-input/build/css/intlTelInput.css";
// import "./commercial/bootstrap/css/bootstrap.min.css";
import "./App.scss";
import Start from "./views/Start";
import Registration from "./views/Registration";
import Login from "./views/Login";
import Home from "./views/Home";
import PasswordReset from "./views/PasswordReset";
import Amplify from "aws-amplify";
import { Auth, Hub, Storage, API, Analytics } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

Amplify.configure({
  Auth: {
    identityPoolId: "eu-west-1:074e79e2-3122-411a-8a96-9f51675152ff",
    // REQUIRED - Amazon Cognito Region
    region: "eu-west-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-1_QHxELz5qn",
    userPoolWebClientId: "72lr8fbf82sbo9c115ksr16u5n",
  },
  Storage: {
    AWSS3: {
      bucket: "vod-source-t835rdmjfxx2", //REQUIRED -  Amazon S3 bucket
      region: "eu-west-1", //OPTIONAL -  Amazon service region
    },
  },
  // Analytics: {
  //   AWSPinpoint: {
  //     // Amazon Pinpoint App Client ID
  //     appId: "b56de6d3fc754719ac4017df3fe9c8e5",
  //     // Amazon service region
  //     region: "eu-west-1",
  //     mandatorySignIn: false,
  //   },
  // },
  aws_appsync_graphqlEndpoint:
    "https://p5cbrelhdzdy7kxk2b77xaxaai.appsync-api.eu-west-1.amazonaws.com/graphql",
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS", // You have configured Auth with Amazon Cognito User Pool ID and Web Client Id
  // ...
});

const currentConfig = Auth.configure();
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route
            render={({ location }) => {
              const { pathname, key } = location;

              return (
                <Switch location={location}>
                  <Route exact path="/" component={Start} />
                  <Route path="/login" component={Login} />
                  <Route path="/registration" component={Registration} />
                  <Route path="/home" component={Home} />
                  <Route path="/password-reset" component={PasswordReset} />
                </Switch>
              );
            }}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
