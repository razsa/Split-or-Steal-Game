import React, { Component } from "react";
import "../App.css";
import logo from "../images/logo.svg";
//TODO : CssTransitionGroup Animation
//TODO : Add Animation for EVEN STEAL and odd SPLIT

class Loading extends Component {
  render() {
    let { loading } = this.props;
    if (loading) {
      return <img src={logo} className="App-logo" alt="logo" />;
    } else {
      return null;
    }
  }
}

export default Loading;
