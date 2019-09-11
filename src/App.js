import React, {Component}  from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./commercial/bootstrap/css/bootstrap.min.css";
import "intl-tel-input/build/css/intlTelInput.css";
import "./App.scss";
import Start from "./views/Start";
import Registration from "./views/Registration";
import Login from "./views/Login";
import Home from "./views/Home";

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
