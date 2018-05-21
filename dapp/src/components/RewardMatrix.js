import React, { Component } from "react";
import "../App.css";

class RewardMatrix extends Component {
  render() {
    let { k, gameFees, minBet, maxBet, stageTimeout } = this.props;
    return (
      <div className="Reward-matrix StickyRight">
        <br />
        Game Rules
        <div className="Reward-matrix-list">
          <ul>
            <li>
              <div style={{ paddingTop: "10px" }}>
                <a href="#reward-factor">Reward Factor(K)</a> is {k}
              </div>
            </li>
            <li>
              <div style={{ paddingTop: "10px" }}>
                <a href="#game-fees">Game Fees(F)</a> is {gameFees}
              </div>
            </li>
            <li>
              <div style={{ paddingTop: "10px" }}>Minimum Bet is {minBet}</div>
            </li>
            <li>
              <div style={{ paddingTop: "10px" }}>Maximum Bet is {maxBet}</div>
            </li>
            <li>
              <div style={{ paddingTop: "10px" }}>
                <a href="#stage-timeout">Stage Timeout</a> is {stageTimeout}
              </div>
            </li>
            <li>
              <div style={{ paddingTop: "10px" }}>No Cheating !</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RewardMatrix;
