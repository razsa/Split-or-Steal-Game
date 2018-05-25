import React, { Component } from "react";
import AutosizeInput from "react-input-autosize";
import "../App.css";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      X: 2, //exmaple value
      Y: 1 //example value
    };
  }

  updateX = event => {
    const val = event.target.value;
    this.setState({
      X: val
    });
  };

  updateY = event => {
    const val = event.target.value;
    this.setState({
      Y: val
    });
  };

  render() {
    let {
      k,
      metamaskInstalled,
      noAccountsInMetamask,
      changeNetwork
    } = this.props;

    let interactiveRewardMatrix =
      !metamaskInstalled || noAccountsInMetamask || changeNetwork ? null : (
        <div>
          <b>
            <h3>Interactive Reward Matrix</h3>
          </b>
          Enter your and opponent's hypothetical bet amounts to visualize
          winnings.
          <br />
          <br />
          I Bet :{" "}
          <AutosizeInput
            autoComplete="off"
            inputClassName="game-input"
            onChange={this.updateX}
            value={this.state.X}
          />
          {"   "}
          Opponent Bets :{" "}
          <AutosizeInput
            autoComplete="off"
            inputClassName="game-input"
            onChange={this.updateY}
            value={this.state.Y}
          />
          <br />
          <br />
          <b>
            R(X,Y,K) => R({this.state.X}, {this.state.Y}, {k})
          </b>
          <br />
          <table className="App-table">
            <tbody>
              <tr>
                <th>(Me \ Opponent)</th>
                <th>Split</th>
                <th>Steal</th>
                {/* <th>Disqualified</th> */}
              </tr>
              <tr>
                <td>
                  <b>Split</b>
                </td>
                <td>
                  ({(parseFloat(this.state.X) + parseFloat(this.state.Y)) / 2})
                </td>
                <td>
                  0 \{" "}
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.Y)
                  )}
                </td>
                {/* <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.X)
                  )}{" "}
                  \ 0
                </td> */}
              </tr>
              <tr>
                <td>
                  <b>Steal</b>
                </td>
                <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.X)
                  )}{" "}
                  \ 0
                </td>
                <td>
                  {(2 - k) *
                    Math.max(
                      0,
                      (parseFloat(this.state.X) - parseFloat(this.state.Y)) / 2
                    )}{" "}
                  \
                  {(2 - k) *
                    Math.max(
                      0,
                      (parseFloat(this.state.Y) - parseFloat(this.state.X)) / 2
                    )}
                </td>
                {/* <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.X)
                  )}{" "}
                  \ 0
                </td> */}
              </tr>
              {/* <tr>
                <td>
                  <b>Disqualified</b>
                </td>
                <td>
                  0 \{" "}
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.Y)
                  )}{" "}
                </td>
                <td>
                  0 \{" "}
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.Y)
                  )}{" "}
                </td>
                <td>0 \ 0</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      );

    return (
      <div id="about" className="About">
        <br />
        <div className="App-about">
          <b>
            <h2>What is the game?</h2>
          </b>
          It is a two player game where each player is asked to bet some
          amount(X, Y) to play the game. <br /> Based on X and Y, Smart contract
          would generate a <a href="#reward-matrix">Reward Matrix</a>, on which
          game will be played.
        </div>
        <div id="reward-matrix" className="App-about">
          <b>
            <h2>What is the Reward Matrix?</h2>
          </b>
          <b>R(X,Y,K)</b> => <br />
          <table className="App-table">
            <tbody>
              <tr>
                <th>(X\Y)</th>
                <th>Split</th>
                <th>Steal</th>
                {/* <th>Disqualified</th> */}
              </tr>
              <tr>
                <td>
                  <b>Split</b>
                </td>
                <td>(X+Y)/2</td>
                <td>0 \ Min(X+Y, K*Y) </td>
                {/* <td>Min(X+Y, K*X) \ 0</td> */}
              </tr>
              <tr>
                <td>
                  <b>Steal</b>
                </td>
                <td>Min(X+Y, K*X) \ 0</td>
                <td>Max(0, (2-K)*((X-Y)/2)</td>
                {/* <td>Min(X+Y, K*X) \ 0</td> */}
              </tr>
              {/* <tr>
                <td>
                  <b>Disqualified</b>
                </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ 0</td>
              </tr> */}
            </tbody>
          </table>
          <br />
          <b>where</b>,
          <div id="reward-factor">
            <ul className="App-list">
              <li>
                {" "}
                X & Y are bet amounts by PlayerX and PlayerY respectively
              </li>
              <li>
                2 >= K > 1, K is <b>Reward Factor</b>
              </li>
            </ul>
          </div>
          {interactiveRewardMatrix}
        </div>

        <div className="App-about">
          <b>
            <h2>How to read Reward Matrix case by case?</h2>
          </b>
          <div className="Center">
            <ol className="App-list">
              <li>
                If X chooses to SPLIT and Y also chooses to SPLIT, then they win
                (X+Y)/ 2 each, thus player betting lower wins.
              </li>
              <li>
                {" "}
                If X chooses to SPLIT and Y chooses to STEAL, then Y gains K
                times of Y (Capped by X+Y) and X gets 0, thus the higher you bet
                higher you win.
              </li>
              <li>
                {" "}
                If X chooses to STEAL and Y chooses to SPLIT, then X gains K
                times of X (Capped by X+Y) and Y gets 0, thus the higher you bet
                higher you win.
              </li>
              <li>
                If X chooses to STEAL and Y also chooses to STEAL, then they win
                (2-K) times of (X-Y)/2, thus player betting higher gets some
                part back.
                <ul>
                  <li>
                    Also note that reward in this case inversely proportional to
                    Win if only one of thems steals
                  </li>

                  <li>
                    Higher the reward in Single STEAL case Lower the reward in
                    Both STEAL case
                  </li>
                </ul>
              </li>

              <li>
                If a player's opponent gets disqualified and the player not,
                then player gains K times of player's bet (Capped by X+Y)
                irrespective of player's choice.
              </li>

              <li>
                If both players get disqualified, both loose complete bet.
              </li>
            </ol>
          </div>
          <br />
        </div>
        <div className="App-about">
          <b>
            <h2>GAME PLAY</h2>
          </b>
          <h3>Game has 3 Phases</h3>
          <ol className="App-list">
            <li>
              <b>Registeration, Commit Bets & Submit Encrypted Choice</b>
              <ul className="App-list">
                <li>
                  Player will submit their bet amounts and encrypted choices.
                  **(THIS WOULD COST GAS)**{" "}
                </li>
                <ul>
                  <li>Encryption is done by DApp.</li>
                  <li>
                    Players simply need to choose any <b>ODD</b> number for{" "}
                    <b>SPLIT</b> or any <b>EVEN</b> number for <b>STEAL</b>
                  </li>
                </ul>
                <li>
                  This can be done in two ways,
                  <ul>
                    <li>
                      Either by starting a <a href="#new-game">new game</a>.
                    </li>
                    <li>
                      Or by <a href="#all-games">Joining</a> an exiting game.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <br />
            <br />
            <li>
              <b>Reveal choice </b>
              <ul className="App-list">
                <li>
                  {" "}
                  Player will submit unencrypted choice
                  <ul>
                    <li>
                      i.e. the number (even or odd) they actually chose in
                      previous round. **(THIS WOULD COST GAS)**
                    </li>
                  </ul>
                </li>
                <li>
                  {" "}
                  Contract would evaluate the encryption of the choice and
                  compare with previously submitted choice.{" "}
                </li>
                <li>
                  {" "}
                  If Both do not match, player will be marked disqualified for
                  that game and an event will be fired.(EVENT){" "}
                </li>
              </ul>
            </li>
            <br />
            <li>
              <b>Claim Reward </b>
              <ol>
                <li>
                  {" "}
                  Contract would reward player according to Reward Matrix.
                  **(THIS WOULD COST GAS)**{" "}
                </li>
                <li id="game-fees">
                  Reward would be given after deducting <b>Game Fees(F)</b> from
                  Reward amount
                </li>
              </ol>
            </li>
          </ol>
          <br />
          <div id="abandon-game">
            <h3>Abandon Game</h3>
            Player who started game can abandon it if no body joined the game.
            <ul className="App-list">
              <li>
                If Player abandon's game <b>before</b>{" "}
                <a href="#stage-timeout">Stage Timeout</a> then,
                <ul>
                  <li>
                    Player's bet amount is refunded dedecuting{" "}
                    <a href="#game-fees">Game Fees(F)</a>
                  </li>
                </ul>
                else
                <ul>
                  <li>Player's entire bet amount is refunded.</li>
                </ul>
                So it is advisable to let you game be open till it expires.
              </li>
            </ul>
          </div>
          <div id="stage-timeout">
            <h3>Stage Timeout</h3>
            Stage Timeout is used to unlock deadlock situations like,
            <ol className="App-list">
              <li>
                If a game is in revealing stage since a long time because,
                <ul>
                  <li>Either both players did not reveal their choices, OR</li>
                  <li>One of the players did not reveal choice</li>
                </ul>
                then, Admin can diqualify player(s) who did not reveal after
                Stage Timeout.
              </li>
              <br />
              <li>
                If a game is in claim reward stage since a long time and,
                <ul>
                  <li>Either both players did not claim their rewards, OR</li>
                  <li>One of the players did not claim reward</li>
                </ul>
                then, Admin can diqualify player(s) who did not claim reward.
                <ul>
                  <li>
                    This essentially means that Player should claim reward
                    within Stage Timeout amount of time.
                  </li>
                  <li>
                    This is done so that the ether doesn't get locked in
                    contract address
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default About;
