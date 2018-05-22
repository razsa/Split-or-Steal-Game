import React, { Component } from "react";
import "../App.css";
import logo from "../images/logo.svg";
import metamask from "../images/metamask.png";

class MyHeader extends Component {
  render() {
    let {
      metamaskInstalled,
      noAccountsInMetamask,
      changeNetwork,
      netId
    } = this.props;
    let numberOfCoins = 5;
    let warningMessage = !metamaskInstalled
      ? "Please install"
      : noAccountsInMetamask
        ? "Please Log in to"
        : null;
    let subWarning = !metamaskInstalled ? " and refresh the page " : null;
    if (!metamaskInstalled) {
      numberOfCoins = 1;
    } else {
      if (noAccountsInMetamask) {
        numberOfCoins = 3;
      }
    }

    let coins = [];
    for (let i = 0; i < numberOfCoins; i++) {
      coins.push(<img key={i} src={logo} className="App-logo" alt="logo" />);
    }
    let network = "some unknown network";
    switch (netId) {
      case "1":
        network = "the Main Ethereum Network";
        break;
      case "2":
        network = "the deprecated Morden Test Network";
        break;
      case "3":
        network = "the Ropsten Test Network";
        break;
      case "4":
        changeNetwork = false;
        network = "the Rinkeby Test Network";
        break;
      case "42":
        network = "the Kovan Test Network";
        break;
      default:
    }

    return (
      <div>
        <a
          style={{ visibility: "hidden" }}
          href="https://github.com/showmeyourcode/Split-or-Steal-Game"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            style={{ float: "left", border: 0 }}
            src="https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png"
            alt="Fork me on GitHub"
          />
        </a>

        <a
          href="https://github.com/showmeyourcode/Split-or-Steal-Game"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            style={{ float: "right", border: 0 }}
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
            alt="Fork me on GitHub"
          />
        </a>
        <header className="App-header">
          <h1 className="App-title-metamask">
            <b>Welcome to "SPLIT or STEAL" game on BLOCKCHAIN</b>
          </h1>
          <div>
            <b>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/Provably_fair"
              >
                Provably Fair
              </a>
            </b>{" "}
            <a href="#how-provably-fair">(How?)</a>
          </div>
          <br />
          {warningMessage === null ? null : (
            <h2 className="App-title-metamask">
              {warningMessage}{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)"
              >
                Metamask
              </a>{" "}
              {subWarning}
              to play the game.
            </h2>
          )}

          {coins}
          {!metamaskInstalled || noAccountsInMetamask ? null : (
            <div>
              {!changeNetwork ? (
                <div>
                  You can get test Ether from{" "}
                  <a
                    href="http://faucet.rinkeby.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Rinkeby Faucet.
                  </a>
                </div>
              ) : (
                <div>
                  <div>
                    <h2>Looks like you are on {network}.</h2>
                  </div>
                  <div>
                    <h1>
                      Please change your network to Rinkeby Test Network <br />
                      as shown below, in order to play the game.
                    </h1>
                    <img src={metamask} alt="metamask" />
                  </div>
                </div>
              )}
              <div>
                <br />
                <a href="#about">
                  <h3>
                    <b>How to play this game ?</b>
                  </h3>
                </a>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default MyHeader;
