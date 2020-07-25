import React from "react";
import "./index.css";

export default class MainLayout extends React.Component {
  render() {
    const { children } = this.props;
    return <div className="layout-container">{children}</div>;
  }
}
