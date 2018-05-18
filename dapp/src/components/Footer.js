import React, { Component } from "react";
import "../App.css";

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <br />
        <a
          href="https://www.stateofthedapps.com/dapps/split-or-steal"
          target="_blank"
          rel="noopener noreferrer"
        >
          State of the ÐApps
        </a>
        <div>Solidified Audit in progress</div>
        <br />
        {"Powered by Ethereum"}
        <br />
        {"©2018 Rajat Mathur. All Rights Reserved."}
        <br />
        <br />
        {"       "}
      </div>
    );
  }
}

export default Footer;