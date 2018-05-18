import React, { Component } from "react";
import "../App.css";
import AutosizeInput from "react-input-autosize";

class Donate extends Component {
  render() {
    let {
      metamaskInstalled,
      noAccountsInMetamask,
      changeNetwork,
      updateFundValue,
      fundValue,
      fundContract
    } = this.props;
    if (metamaskInstalled && !noAccountsInMetamask && !changeNetwork) {
      return (
        <div className="Footer">
          <div className="Donate">
            <div>
              <h2>Shameless Plug</h2>
            </div>
            <div>If you like the game, Please</div>
            <div>encourage with small donation.</div>

            <div className="Inline">
              <div>
                <AutosizeInput
                  placeholder="Enter donation amount in ETH."
                  inputClassName="game-input"
                  onChange={updateFundValue}
                  value={fundValue}
                />{" "}
              </div>

              <button
                className="button-donation-enabled"
                onClick={fundContract}
              >
                <b>Donate</b>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Donate;
