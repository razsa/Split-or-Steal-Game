import React, { Component } from "react";
import "../App.css";

class Player extends Component {
  render() {
    let { metamaskAccount } = this.props;

    return (
      <div className="Player">
        Your address{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          // TODO : Make sure to change domain according to Smart Contract address
          href={"https://rinkeby.etherscan.io/address/" + metamaskAccount}
        >
          {metamaskAccount}
        </a>
      </div>
    );
  }
}

export default Player;
