import React, { Component } from "react";
import "../App.css";

class Player extends Component {
  render() {
    let { metamaskAccount, blockExplorerUri, balance, netId } = this.props;
    let network = "unknown";
    switch (netId) {
      case "1":
        network = "Main Ethereum Network";
        break;
      case "2":
        network = "deprecated Morden Test Network";
        break;
      case "3":
        network = "Ropsten Test Network";
        break;
      case "4":
        network = "Rinkeby Test Network";
        break;
      case "42":
        network = "Kovan Test Network";
        break;
      default:
    }
    return (
      <div key="player" className="Player" id="player">
        <div>
          Your address{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={blockExplorerUri + "/address/" + metamaskAccount}
          >
            {metamaskAccount}
          </a>
        </div>
        <div>Your balance is {balance}</div>
        <div>Your network is {network}</div>
      </div>
    );
  }
}

export default Player;
