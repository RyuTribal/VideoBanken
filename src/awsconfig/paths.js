import React from "react";
import Home from "../components/Home";
import Login from "../components/Login";
import Registration from "../components/Registration";
import PasswordForgot from "../components/PasswordForgot";
import Users from "../components/Users";
import { Switch, Route } from "react-router-dom";
export const paths = [
  {
    path: "/login",
    component: Login,
    isAuthenticated: false,
  },
  {
    path: "/registration",
    component: Registration,
    isAuthenticated: false,
  },
  {
    path: "/password-reset",
    component: PasswordForgot,
    isAuthenticated: false,
  },
  {
    path: "/home",
    component: Home,
    isAuthenticated: true,
    onMenu: true,
    text: "Feed",
    pos: "top",
    icon: "VideoLabel",
  },
  {
    path: "/users/:username",
    component: Users,
    text: "User",
    isAuthenticated: true,
    onMenu: false,
  },
];
export function RenderRoutes(props) {
  return (
    <Route
      render={({ location }) => {
        return (
          <Switch location={location}>
            {paths.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                render={() => (
                  <route.component
                    setTitle={(title, selectedItem) => {
                      try {
                        props.setTitle(title, selectedItem);
                      } catch {}
                    }}
                  />
                )}
              />
            ))}
          </Switch>
        );
      }}
    />
  );
}
