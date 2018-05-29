import React, { Component } from "react";
import "../App.css";
import logo from "../images/logo.svg";
import Social from "./Social.js";
import metamaskMain from "../images/metamask_main_net.png";
import metamaskRinkeby from "../images/metamask_rinkeby_testnet.png";
import metamaskDownload from "../images/metamask_download.png";
import { UserAgentProvider, UserAgent } from "@quentin-sommer/react-useragent";

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
      ? "Please install browser plugin "
      : noAccountsInMetamask
        ? "Please Log in to browser plugin "
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
        network = "the Rinkeby Test Network";
        break;
      case "42":
        network = "the Kovan Test Network";
        break;
      default:
    }
    let metamaskDownloadImage = (
      <img
        src={metamaskDownload}
        alt="metamaskDownload"
        width="150"
        height="43"
      />
    );
    let installMetamask = (
      <h2 className="App-title-metamask">
        {warningMessage}{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://metamask.io/"
        >
          Metamask
        </a>{" "}
        {subWarning}
        to play the game.
      </h2>
    );
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
          <UserAgentProvider ua={window.navigator.userAgent}>
            <div>
              <UserAgent mobile>
                <p />
                <div style={{ color: "rgba(255, 8, 68, 0.842)" }}>
                  <b>
                    This is game is currently available only on Desktop.<br />Join
                    us on{" "}
                    <a
                      href="https://t.me/splitorsteal"
                      title="Telegram"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-slimstat="5"
                    >
                      telegram
                    </a>
                    {" and "}
                    <a
                      href="https://www.facebook.com/Split-or-Steal-756882654699219/"
                      title="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-slimstat="5"
                    >
                      facebook
                    </a>{" "}
                    for updates on mobile version or open this on dektop.
                  </b>
                </div>
              </UserAgent>
              <UserAgent computer mac tablet>
                {warningMessage === null ? null : (
                  <div>
                    {metamaskInstalled && warningMessage !== null
                      ? installMetamask
                      : null}
                    {metamaskInstalled ? null : (
                      <div>
                        <UserAgent chrome>
                          {installMetamask}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)"
                          >
                            {" "}
                            {metamaskDownloadImage}
                          </a>
                        </UserAgent>
                        <UserAgent firefox>
                          {installMetamask}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                          >
                            {" "}
                            {metamaskDownloadImage}
                          </a>
                        </UserAgent>
                        <UserAgent returnfullParser>
                          {parser =>
                            !parser
                              .getBrowser()
                              .name.toLowerCase()
                              .includes("opera") ? null : (
                              <div>
                                {installMetamask}
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://addons.opera.com/en/extensions/details/metamask/"
                                >
                                  {" "}
                                  {metamaskDownloadImage}
                                </a>
                              </div>
                            )
                          }
                        </UserAgent>
                        <UserAgent returnfullParser>
                          {parser =>
                            !parser
                              .getBrowser()
                              .name.toLowerCase()
                              .includes("opera") &&
                            !parser
                              .getBrowser()
                              .name.toLowerCase()
                              .includes("chrome") &&
                            !parser
                              .getBrowser()
                              .name.toLowerCase()
                              .includes("firefox") ? (
                              <div style={{ color: "rgba(255, 8, 68, 0.842)" }}>
                                <b>
                                  You'll need{" "}
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://metamask.io/"
                                  >
                                    Metamask
                                  </a>{" "}
                                  to play this game.<br /> Metamask is not
                                  supported for your browser.<br /> Please use
                                  Chrome/Firefox/Opera.
                                </b>
                              </div>
                            ) : null
                          }
                        </UserAgent>
                      </div>
                    )}
                  </div>
                )}
              </UserAgent>
            </div>
          </UserAgentProvider>

          {coins}
          {!metamaskInstalled || noAccountsInMetamask ? null : (
            <div>
              {!changeNetwork ? (
                netId === "4" ? (
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
                ) : null
              ) : (
                <div style={{ color: "rgba(255, 8, 68, 0.842)" }}>
                  <div>
                    <h2>Looks like you are on {network}.</h2>
                  </div>
                  <div>
                    <h2>
                      Please change your network to Main Ethereum Network or
                      Rinkeby Test Network<br />
                      as shown below, in order to play the game.
                    </h2>
                    <img
                      src={metamaskMain}
                      alt="metamaskMain"
                      width="215"
                      height="220"
                    />
                    <img
                      src={metamaskRinkeby}
                      alt="metamaskRinkeby"
                      width="215"
                      height="220"
                    />
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
          <Social className="social-links-top" />
        </header>
      </div>
    );
  }
}

export default MyHeader;
