import React, { Component } from "react";
import "../App.css";

class Fair extends Component {
  render() {
    return (
      <div id="how-provably-fair" className="App-fair">
        <b>
          <h2>
            How is this game{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://en.wikipedia.org/wiki/Provably_fair"
            >
              Provably Fair
            </a>?
          </h2>
        </b>
        <div className="Center">
          <ol className="App-list">
            <li>
              Contract code can be found{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://rinkeby.etherscan.io/address/0xbf601702214a7071684d17981ad6d0a65366499b#code"
              >
                here
              </a>.
            </li>
            <li>
              {" "}
              All transactions on contract can be found{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://rinkeby.etherscan.io/address/0xbf601702214a7071684d17981ad6d0a65366499b"
              >
                here
              </a>.
            </li>
          </ol>
        </div>
        <br />
      </div>
    );
  }
}

export default Fair;
