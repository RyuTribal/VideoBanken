import React, { Component } from "react";
import { RenderRoutes } from "../awsconfig/paths";
class UnAuthView extends Component {
  render() {
    return (
      <div className="landing">
        <RenderRoutes />
      </div>
    );
  }
}

export default UnAuthView;
