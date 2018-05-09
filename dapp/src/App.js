import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";

//TODO : ETHEREUM_CLIENT usage , can be scoped to file instead of App
//TODO : NO SHOW WHO You are paired other wise people can exploit it
//TODO : CssTransitionGroup Animation

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
    let { k, b } = this.props;
    //TODO : Add Fees etc.. game rules
    return (
      <div id="about" className="App-header">
        <div className="App-about">
          <br />
          <b>What is the game?</b>
          <br />
          <br /> It is a two player game(X, Y) where each player is asked to bet
          some amount(X, Y) to play the game. <br /> Based on X and Y, Smart
          contract would generate a Reward Matrix, on which game will be played.
        </div>
        <div className="App-about">
          <br />
          <b>What is the Reward Matrix?</b>
          <br />
          <br />
          <b>R(X,Y,K,B)</b> => <br />
          <table className="App-table">
            <tbody>
              <tr>
                <th>(X\Y)</th>
                <th>Split</th>
                <th>Steal</th>
                <th>Disqualified</th>
                <th>No Opponent</th>
              </tr>
              <tr>
                <td>
                  <b>Split</b>
                </td>
                <td>(X+Y)/2</td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>Min(X+Y, K*X) \ 0</td>
                <td>Min(X+Y, B*X) \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>Steal</b>
                </td>
                <td>Min(X+Y, K*X) \ 0</td>
                <td>Min(X+Y, K*Max(0,X-Y))</td>
                <td>Min(X+Y, K*X) \ 0</td>
                <td>Min(X+Y, B*X) \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>Disqualified</b>
                </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ 0</td>
                <td>0 \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>No Opponent</b>
                </td>
                <td>0 \ Min(X+Y, B*Y) </td>
                <td>0 \ Min(X+Y, B*Y) </td>
                <td>0 \ 0</td>
                <td>0 \ 0</td>
              </tr>
            </tbody>
          </table>
          <br />
          <b>where</b>,
          <ul className="App-list">
            <li> X & Y are bet amounts by PlayerX and PlayerY respectively</li>
            <li>K > 1</li>
            <li>B > 1</li>
          </ul>
          <b>Interactive Reward Matrix</b>
          <br />
          <br />
          Enter your and opponent's hypothetical bet amounts to visualize
          winnings.
          <br />
          <br />
          I Bet :{" "}
          <AutosizeInput
            autoComplete="off"
            inputClassName="input"
            onChange={this.updateX}
            value={this.state.X}
          />
          {"   "}
          Opponent Bets :{" "}
          <AutosizeInput
            autoComplete="off"
            inputClassName="input"
            onChange={this.updateY}
            value={this.state.Y}
          />
          <br />
          <br />
          <b>
            R(X,Y,K,B) => R({this.state.X}, {this.state.Y}, {k}, {b})
          </b>
          <br />
          <table className="App-table">
            <tbody>
              <tr>
                <th>(Me \ Opponent)</th>
                <th>Split</th>
                <th>Steal</th>
                <th>Disqualified</th>
                <th>No Opponent</th>
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
                <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.X)
                  )}{" "}
                  \ 0
                </td>
                <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    (b * parseFloat(this.state.X)).toPrecision(4)
                  )}{" "}
                  \ 0
                </td>
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
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k *
                      Math.max(
                        0,
                        parseFloat(this.state.X) - parseFloat(this.state.Y)
                      )
                  )}{" "}
                  \
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k *
                      Math.max(
                        0,
                        parseFloat(this.state.Y) - parseFloat(this.state.X)
                      )
                  )}
                </td>
                <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    k * parseFloat(this.state.X)
                  )}{" "}
                  \ 0
                </td>
                <td>
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    (b * parseFloat(this.state.X)).toPrecision(4)
                  )}{" "}
                  \ 0
                </td>
              </tr>
              <tr>
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
                <td>0 \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>No Opponent</b>
                </td>
                <td>
                  0 \{" "}
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    (b * parseFloat(this.state.Y)).toPrecision(4)
                  )}{" "}
                </td>
                <td>
                  0 \{" "}
                  {Math.min(
                    parseFloat(this.state.X) + parseFloat(this.state.Y),
                    (b * parseFloat(this.state.Y)).toPrecision(4)
                  )}{" "}
                </td>
                <td>0 \ 0</td>
                <td>0 \ 0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="App-about">
          <br />
          <b>How to read Reward Matrix case by case?</b>
          <br />
          <br />
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
                K times of Max(0, X-Y) (Capped by X+Y), thus player betting
                higher gets some part back.
              </li>

              <li>
                If a player's opponent gets disqualified and the player not,
                then player gains K times of player's bet (Capped by X+Y).
              </li>

              <li>
                If both players get disqualified, both loose complete bet.
              </li>

              <li>
                If a player remains odd one out, i.e. is not paired with any
                one, that player gains B times of player's bet.
                <ul>
                  <li>This can happen if total players who bet are odd.</li>
                </ul>
              </li>
            </ol>
          </div>
          <br />
        </div>
        <div className="App-about">
          <br />
          <b>How does contract earn?</b>
          <br />
          <br />
          <div className="Center">
            <ol className="App-list">
              <li>
                If both players choose to split, contract neither wins nor
                looses.
              </li>
              <li>
                {" "}
                If one player chooses split and other steal, contract
                wins/looses based on how much did the winner bet in comparision
                to looser.
              </li>
              <li>
                {" "}
                If both players choose to steal, contract wins 2 times Y where Y
                is the lower bet.
              </li>
            </ol>
          </div>
          <br />
        </div>
        <div className="App-about">
          <br />
          <b>GAME PLAY</b>
          <br />
          <br />
          Game has 4 Phases
          <ol className="App-list">
            <li>
              <b>Registeration & Commit Bets</b>
              <ul className="App-list">
                <li>
                  This phase would be opened by contract owner for a fixed
                  amount of time. (START){" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when Registration starts.(EVENT){" "}
                </li>
                <li>
                  {" "}
                  Players will submit their bet amounts in the given time.
                  **(THIS WOULD COST GAS)**{" "}
                </li>
                <li>
                  {" "}
                  Player will be also be dynamically grouped in a pair of 2 as
                  they are submitting the bets.{" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when two players are paired with each
                  other.
                </li>
                <li>
                  {" "}
                  Only player who could successfully submit bets in the given
                  time, will be eligible to play the game.{" "}
                </li>
                <li>
                  {" "}
                  Once this phase is marked over by contract owner no more bets
                  will be accepted. (STOP){" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when registration closes. (EVENT)
                </li>
              </ul>
            </li>
            <br />
            <li>
              <b>Submit encrypted *steal* or *split* choice</b>
              <ul className="App-list">
                <li>
                  {" "}
                  This phase would be opened by contract owner for a fixed
                  amount of time. (START){" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when Registration starts.(EVENT){" "}
                </li>
                <li>
                  Player will submit encrypted choices. **(THIS WOULD COST
                  GAS)**{" "}
                </li>
                <ul>
                  <li>Encryption is done by DApp.</li>
                  <li>
                    Players simply need to choose any <b>ODD</b> number for{" "}
                    <b>SPLIT</b> or any <b>EVEN</b> number for <b>STEAL</b>
                  </li>
                </ul>
                <li>
                  {" "}
                  Once this phase is marked over by contract owner no more
                  encrypted choice submissions will be accepted. (STOP){" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when encrypted choice submission ends.
                  (EVENT)
                </li>
              </ul>
            </li>
            <br />
            <li>
              <b>Reveal choice </b>
              <ul className="App-list">
                <li>
                  This phase would be opened by contract owner for fixed amount
                  of time. (START)(EVENT){" "}
                </li>
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
                <li>
                  {" "}
                  Once this phase is marked over by contract owner no more
                  unencrypted choice submissions will be accepted. (STOP){" "}
                </li>
                <li>
                  {" "}
                  An event will be fired when Reveal Choice Submission ends.
                  (EVENT)
                </li>
              </ul>
            </li>
            <br />
            <li>
              <b>Claim Reward Winners </b>
              <ol>
                <li>
                  This phase would be opened by contract owner. (START)(EVENT)
                </li>
                <li>
                  {" "}
                  Contract would check player claiming reward for certain
                  conditions including disqualified.{" "}
                </li>
                <li>
                  {" "}
                  Only if player passes all the conditions, player will receive
                  his reward as per reward matrix.
                </li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

class Fair extends Component {
  render() {
    return (
      <div id="how-provably-fair" className="App-about">
        <br />
        <b>
          How is this game{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Provably_fair"
          >
            Provably Fair
          </a>?
        </b>
        <br />
        <br />
        <div className="Center">
          <ol className="App-list">
            <li>
              Contract code can be found{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://rinkeby.etherscan.io/address/0x9b5f424c2705ebaf35bd730011b7caefcc7776f5#code"
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
                href="https://rinkeby.etherscan.io/address/0x9b5f424c2705ebaf35bd730011b7caefcc7776f5"
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

class MyHeader extends Component {
  render() {
    let { metamaskInstalled, noAccountsInMetamask } = this.props;
    let numberOfCoins = 5;
    let warningMessage = !metamaskInstalled
      ? "Please install"
      : noAccountsInMetamask
        ? "Please Log in to"
        : null;
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
    return (
      <header className="App-header">
        <h1 className="App-title-metamask">
          Welcome to "SPLIT or STEAL" game on BLOCKCHAIN
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
            to play the game.
          </h2>
        )}

        {coins}
        {!metamaskInstalled || noAccountsInMetamask ? null : (
          <div className="App-info">
            <div style={{ paddingTop: "0px" }}>
              <a href="#about">
                <b>How to play this game ?</b>
              </a>
            </div>
          </div>
        )}
      </header>
    );
  }
}

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Global State
      contractBalance: "being calculated",
      warning: "",
      contractOwner: null,
      metamaskAccount: null,
      metamaskInstalled: false,
      noAccountsInMetamask: true,
      contract: null,
      //Game State Variables
      currentGame: 0,
      k: "being calculated", //Reward Factor
      b: "being calculated", //Odd Player Bonus Factor
      gameState: "Fetching the latest game state... Please wait",
      registerationOpen: false,
      playStarted: false,
      revealing: false,
      lastGameFinished: false,
      //Player Variables
      stateLocalOverride: false,
      //Temp Local Variables Start
      suspended: false,
      registered: false,
      played: false,
      revealed: false,
      disqualified: false,
      claimedReward: false,
      //Temp Local Variables End
      canRegister: false,
      canPlay: false,
      canReveal: false,
      canClaimReward: false,
      choice: -1,
      betAmount: 0, //in Ether
      preInputText: "Place your bet here.",
      inputPlaceholder: "Enter amount to bet.",
      postInputText: "(in ether)",
      inputValue: ""
    };
  }

  componentWillMount = () => {
    if (typeof window.web3 !== "undefined") {
      let client = new Web3(window.web3.currentProvider);
      this.setState({
        contract: new client.eth.Contract(
          abi,
          "0x9b5f424c2705ebaf35bd730011b7caefcc7776f5"
        ),
        contractAddress: "0x9b5f424c2705ebaf35bd730011b7caefcc7776f5"
      });
      //Check if metamask is installed/enabled
      if (
        new Web3(window.web3.currentProvider).currentProvider.isMetaMask ===
        true
      ) {
        this.setState({
          metamaskInstalled: true
        });
        new Web3(window.web3.currentProvider).eth.getAccounts(
          (error, accounts) => {
            if (accounts.length === 0) {
              console.error("No Accounts in Metamask");
            } else {
              this.setState({
                noAccountsInMetamask: false,
                metamaskAccount: accounts[0]
              });
            }
            if (
              this.state.metamaskInstalled &&
              !this.state.noAccountsInMetamask
            ) {
              this.setContractOwner();
            } else {
              console.error("Not calling Init.");
              console.error(this.state.metamaskInstalled);
              console.error(!this.state.noAccountsInMetamask);
            }
          }
        );
      } else {
        // Another web3 provider
        console.error("Some unknown web 3 provider found.");
      }
    } else {
      // No web 3 provider
      console.error("No web 3 provider found.");
    }
  };

  setContractOwner = () => {
    this.state.contract.methods
      .getOwner()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(result => {
        this.setState({
          contractOwner: result
        });
        console.log("Contract Owner : " + result);
        this.registerMetamaskAddressChangeListner();
        this.registerStateListener();
      });
  };

  registerMetamaskAddressChangeListner = () => {
    setInterval(() => {
      new Web3(window.web3.currentProvider).eth.getAccounts((err, accounts) => {
        if (err) {
          return;
        }
        if (accounts.length === 0) {
          this.setState({
            noAccountsInMetamask: true
          });
          return;
        }
        if (this.state.metamaskAccount !== accounts[0]) {
          this.setState({
            metamaskAccount: accounts[0],
            gameState: "Fetching the latest game state... Please wait",
            warning: ""
          });
          console.log("Metamask Account Changed");
        }
      });
    }, 2000);
  };

  setPlayerState = currentGameState => {
    if (currentGameState._gameNumber <= 0) {
      this.setState({
        gameState: "No Games have been played yet. Wait for game to start."
      });
      return;
    }
    this.state.contract.methods
      .getPlayerState(currentGameState._gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(result => {
        // console.log("PLAYER STATE RESULT");
        // console.log(result);

        // Player State
        let suspended = result._suspended;
        let registered = result._registered;
        let played = result._played;
        let revealed = result._revealed;
        let disqualified = result._disqualified;
        let claimedReward = result._claimedReward;

        if (this.state.stateLocalOverride) {
          if (
            suspended ||
            (registered === this.state.registered &&
              played === this.state.played &&
              revealed === this.state.revealed &&
              claimedReward === this.state.claimedReward)
          ) {
            this.setState({
              stateLocalOverride: false
            });
          } else {
            return;
          }
        }

        //Dummy to check when to turn off State Local Override
        this.setState({
          suspended: suspended,
          registered: registered,
          played: played,
          revealed: revealed,
          disqualified: disqualified,
          claimedReward: claimedReward
        });

        let betAmount =
          new Web3(window.web3.currentProvider).utils
            .fromWei(result._betAmount, "ether")
            .toString() + " ether";

        let reward =
          new Web3(window.web3.currentProvider).utils
            .fromWei(result._reward, "ether")
            .toString() + " ether";

        // Game State
        let registerationOpen = currentGameState._registerationOpen;
        let playStarted = currentGameState._playStarted;
        let revealing = currentGameState._revealing;
        let lastGameFinished = currentGameState._lastGameFinished;
        let gameNumber = parseInt(currentGameState._gameNumber, 10);
        let totalPlayers = currentGameState._totalPlayers;

        if (suspended) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: false,
            preInputText: "",
            inputPlaceholder: "You are not eligible to bet.",
            postInputText: "",
            gameState: "You are not allowed to play as you are suspended."
          });
        } else if (claimedReward) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: false,
            preInputText: "Wait for next game to bet.",
            inputPlaceholder: "Not accepting any bets",
            postInputText: "",
            gameState:
              " You have already claimed reward for Game " +
              this.state.currentGame +
              ". You had bet " +
              betAmount +
              " and you got back " +
              reward
          });
        } else if (disqualified) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: false,
            preInputText: "Wait for next game to bet.",
            inputPlaceholder: "Not accepting any bets",
            postInputText: "",
            gameState:
              " You have been disqualified for Game " +
              this.state.currentGame +
              ". You had bet " +
              betAmount
          });
        } else if (revealed) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: revealing ? false : true,
            preInputText: "Wait for next game to bet.",
            inputPlaceholder: "Not accepting any bets",
            postInputText: "",
            gameState: revealing
              ? "Wait for Game " +
                this.state.currentGame +
                " to be finished to claim reward" +
                " You had bet " +
                betAmount
              : "Claim your reward for Game " +
                this.state.currentGame +
                " You had bet " +
                betAmount
          });
        } else if (played) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: playStarted ? false : revealing ? true : false,
            canClaimReward: false,
            preInputText: playStarted
              ? "Wait for next round."
              : revealing
                ? "Reveal your choice for Game Number " + gameNumber
                : "Wait for next game to bet",
            inputPlaceholder: playStarted
              ? "Not accepting any bets"
              : revealing
                ? "Enter Same Choice Again"
                : "Not accepting any bets",
            postInputText: "",
            gameState: playStarted
              ? "Wait for Reveal mode to start for Game " +
                this.state.currentGame +
                " to confirm your choice again." +
                " You had bet " +
                betAmount
              : revealing
                ? "Enter your previously selected choice.([ODD] for SPLIT or [EVEN] for STEAL) for Game " +
                  this.state.currentGame
                : "You are not eligible to play as you didn't reveal your choice for game " +
                  this.state.currentGame +
                  " You had bet " +
                  betAmount
          });
        } else if (registered) {
          this.setState({
            canRegister: false,
            canPlay: registerationOpen ? false : !playStarted ? false : true,
            canReveal: false,
            canClaimReward: false,
            preInputText: registerationOpen
              ? "Wait for next round."
              : playStarted
                ? "Enter your choice for Game " + this.state.currentGame
                : "Wait for next game to bet.",
            inputPlaceholder: registerationOpen
              ? "Not accepting any bets"
              : playStarted
                ? "Enter your choice"
                : "Not accepting any bets",
            postInputText: "",
            gameState: registerationOpen
              ? "Wait for Submit Encrypted Choice Round to start for Game " +
                this.state.currentGame +
                " You had bet " +
                betAmount
              : playStarted
                ? "Enter your choice([ODD] for SPLIT or [EVEN] for STEAL) for Game" +
                  this.state.currentGame
                : "You are not eligible to play as you didn't enter your choice for game " +
                  this.state.currentGame +
                  " You had bet " +
                  betAmount
          });
        } else {
          if (registerationOpen) {
            this.setState({
              canRegister: true,
              preInputText: "Place your bet here.",
              inputPlaceholder: "Enter amount to bet.",
              postInputText: "(in ether)",
              gameState:
                "Place your Bets for Game Number " +
                gameNumber +
                ". A total of " +
                totalPlayers +
                " have registered.",
              canClaimReward: false //TODO : For now claim reward only just after the game finsihes and before next game starts
            });
          } else {
            this.setState({
              canRegister: false,
              canPlay: false,
              canReveal: false,
              canClaimReward: false,
              preInputText: "",
              inputPlaceholder: "Not accepting any bets",
              postInputText: "",
              gameState: "You are late for the game  " + gameNumber
            });
          }
        }
        if (lastGameFinished) {
          this.setState({
            canClaimReward:
              gameNumber === 0
                ? false
                : claimedReward
                  ? false
                  : revealed
                    ? true
                    : false
          });
          if (!claimedReward) {
            this.setState({
              gameState:
                "No game is live currently. Last Game Number " + gameNumber
            });
          }
          if (gameNumber === 0) {
            this.setState({
              gameState: "No games have been played yet. Be Ready !"
            });
          }
        }
      });
  };

  setGameState = () => {
    this.state.contract.methods
      .getGameState()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(result => {
        // console.log("GAME STATE RESULT");
        // console.log(result);

        //Set curent Game Number
        let gameNumber = parseInt(result._gameNumber, 10);
        this.setState({
          currentGame: gameNumber
        });

        this.setState({
          registerationOpen: result._registerationOpen,
          playStarted: result._playStarted,
          revealing: result._revealing,
          lastGameFinished: result._lastGameFinished
        });

        //Set Player State
        this.setPlayerState(result);
      });

    this.state.contract.methods
      .getContractBalance()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(result => {
        this.setState({
          contractBalance:
            new Web3(window.web3.currentProvider).utils
              .fromWei(result, "ether")
              .toString() + " ether"
        });
      });
    this.state.contract.methods
      .getRewardMatrix()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(result => {
        this.setState({
          k: parseFloat((parseInt(result._k, 10) + 100) / 100).toString(),
          b: parseFloat(
            (parseInt(result._oddPlayerBonusPercentage, 10) + 100) / 100
          ).toString()
        });
      });
  };

  registerStateListener = () => {
    setInterval(() => {
      this.setGameState();
    }, 2000);
  };

  //User interaction Methods
  startRegistration = () => {
    let transaction = this.state.contract.methods.startRegistration();
    transaction
      .send({ from: this.state.metamaskAccount })
      .on("transactionHash", hash => {
        console.log("Your request for start registration has been submitted");
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  bet = () => {
    let betInWei = new Web3(window.web3.currentProvider).utils.toWei(
      (parseFloat(this.state.inputValue) * 1e18).toString(),
      "wei"
    );
    console.log(" Bet amount in Wei " + betInWei);
    let transaction = this.state.contract.methods.bet(betInWei);
    transaction
      .send({
        from: this.state.metamaskAccount,
        value: betInWei
      })
      .on("transactionHash", hash => {
        console.log("Your Bet has been submitted " + hash);
        this.setState({
          canRegister: false,
          registered: true,
          stateLocalOverride: true,
          gameState:
            "Your Bet has been submitted. Please wait for it to be confirmed..."
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        //Upto 24 confirmations
        console.log("You bet has got " + confirmationNumber + " confirmations");
        console.log(receipt);
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  startPlay = () => {
    let transaction = this.state.contract.methods.startPlay();
    transaction
      .send({ from: this.state.metamaskAccount })
      .on("transactionHash", hash => {
        console.log("Your request for start play has been submitted");
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  submit = () => {
    var choice = parseInt(this.state.inputValue, 10);
    //That's how you calculate keccak256 from DApp and send to Smart contract
    let encryptedChoice = new Web3(
      window.web3.currentProvider
    ).utils.soliditySha3(choice);

    let transaction = this.state.contract.methods.submit(encryptedChoice);
    transaction
      .send({
        from: this.state.metamaskAccount
      })
      .on("transactionHash", hash => {
        console.log("You choice has been submitted " + hash);
        this.setState({
          canPlay: false,
          played: true,
          stateLocalOverride: true,
          gameState:
            "Your choice has been submitted. Please wait for it to be confirmed..."
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        //Upto 24 confirmations
        console.log(
          "You choice has got " + confirmationNumber + " confirmations"
        );
        console.log(receipt);
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  startReveal = () => {
    let transaction = this.state.contract.methods.startReveal();
    transaction
      .send({ from: this.state.metamaskAccount })
      .on("transactionHash", hash => {
        console.log("Your request for start reveal has been submitted");
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  reveal = () => {
    var choice = parseInt(this.state.inputValue, 10);
    let transaction = this.state.contract.methods.reveal(choice);
    transaction
      .send({
        from: this.state.metamaskAccount
      })
      .on("transactionHash", hash => {
        console.log("You revealed choice has been submitted " + hash);
        this.setState({
          canReveal: false,
          revealed: true,
          stateLocalOverride: true,
          gameState:
            "Your revealed choice has been submitted. Please wait for it to be confirmed..."
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        //Upto 24 confirmations
        console.log(
          "You revealed choice has got " + confirmationNumber + " confirmations"
        );
        console.log(receipt);
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  stopReveal = () => {
    let transaction = this.state.contract.methods.stopReveal();
    transaction
      .send({ from: this.state.metamaskAccount })
      .on("transactionHash", hash => {
        console.log("Your request for stop play has been submitted");
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  fundContract = () => {
    let fundInWei = new Web3(window.web3.currentProvider).utils.toWei(
      (parseFloat(this.state.inputValue) * 1e18).toString(),
      "wei"
    );
    let transaction = this.state.contract.methods.fund();
    transaction
      .send({
        from: this.state.metamaskAccount,
        value: fundInWei
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  withdraw = () => {
    let transaction = this.state.contract.methods.transferBalanceToOwner();
    transaction
      .send({
        from: this.state.metamaskAccount
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", receipt => {
        console.log(receipt);
      });
  };

  claimReward = () => {
    let transaction = this.state.contract.methods.claimRewardK(
      this.state.currentGame
    );
    transaction
      .send({
        from: this.state.metamaskAccount
      })
      .on("transactionHash", hash => {
        console.log("Your claim reward request has been submitted " + hash);
        this.setState({
          canClaimReward: false,
          claimedReward: true,
          stateLocalOverride: true,
          gameState:
            "Your claim reward request has been submitted. Please wait for it to be confirmed..."
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        //Upto 24 confirmations
        console.log(
          "You claim reward request has got " +
            confirmationNumber +
            " confirmations"
        );
        console.log(receipt);
        // let event = receipt.events.RegisterationOpened;
      })
      .on("receipt", receipt => {
        console.log(receipt);
      })
      .on("error", () => {
        this.setState({
          warning: "Contract has insufficient balance. Try again later"
        });
      });
  };

  updateInputValue = event => {
    const val = event.target.value;
    this.setState({
      inputValue: val
    });
  };

  AdminSection = (metamaskAccount, contractOwner) => {
    if (metamaskAccount === contractOwner) {
      const enableRegistertation =
        this.state.lastGameFinished &&
        !this.state.playStarted &&
        !this.state.revealing &&
        !this.state.registerationOpen;

      const enablePlay =
        !this.state.lastGameFinished &&
        !this.state.playStarted &&
        !this.state.revealing &&
        this.state.registerationOpen;

      const enableRevealStart =
        !this.state.lastGameFinished &&
        this.state.playStarted &&
        !this.state.revealing &&
        !this.state.registerationOpen;

      const enableRevealStop =
        !this.state.lastGameFinished &&
        !this.state.playStarted &&
        this.state.revealing &&
        !this.state.registerationOpen;

      const btnAdminRegisterationOpenClassNames = enableRegistertation
        ? "button-admin-enabled"
        : "button-admin";
      const btnAdminPlayStartedClassNames = enablePlay
        ? "button-admin-enabled"
        : "button-admin";
      const btnAdminStartRevealClassNames = enableRevealStart
        ? "button-admin-enabled"
        : "button-admin";
      const btnAdminStopRevealClassNames = enableRevealStop
        ? "button-admin-enabled"
        : "button-admin";
      return (
        <div className="Admin">
          <div style={{ paddingBottom: "10px" }}>
            <b>Game Admin Controls</b>
          </div>
          <div>
            {"         "}
            <button
              className={btnAdminRegisterationOpenClassNames}
              onClick={this.startRegistration}
              disabled={!enableRegistertation}
            >
              Start Registration
            </button>
            {"         "}
            <button
              className={btnAdminPlayStartedClassNames}
              onClick={this.startPlay}
              disabled={!enablePlay}
            >
              Start Play
            </button>
            {"         "}
            <button
              className={btnAdminStartRevealClassNames}
              onClick={this.startReveal}
              disabled={!enableRevealStart}
            >
              Start Reveal
            </button>
            {"         "}
            <button
              className={btnAdminStopRevealClassNames}
              onClick={this.stopReveal}
              disabled={!enableRevealStop}
            >
              Stop Reveal
            </button>
            {"         "}
            <button
              className="button-admin-enabled"
              onClick={this.fundContract}
            >
              Fund Contract
            </button>
            {"         "}
            <button className="button-admin-enabled" onClick={this.withdraw}>
              Withdraw
            </button>
          </div>
        </div>
      );
    }
  };

  PlayerSection = () => {
    //Player button States
    const btnPlayerBetClassNames = this.state.canRegister
      ? "button-player-enabled"
      : "button-player";
    const btnPlayerPlayClassNames = this.state.canPlay
      ? "button-player-enabled"
      : "button-player";
    const btnPlayerRevealClassNames = this.state.canReveal
      ? "button-player-enabled"
      : "button-player";
    const btnPlayerClaimClassNames = this.state.canClaimReward
      ? "button-player-enabled"
      : "button-player";
    return (
      <div className="Player">
        <div style={{ paddingBottom: "10px" }}>
          <b>Player Controls</b>
        </div>
        <div>
          {"         "}
          <button
            className={btnPlayerBetClassNames}
            onClick={this.bet}
            disabled={!this.state.canRegister}
          >
            Bet
          </button>
          {"         "}
          <button
            className={btnPlayerPlayClassNames}
            onClick={this.submit}
            disabled={!this.state.canPlay}
          >
            Submit Encrypted Choice
          </button>
          {"         "}
          <button
            className={btnPlayerRevealClassNames}
            onClick={this.reveal}
            disabled={!this.state.canReveal}
          >
            Reveal Actual Choice
          </button>
          {"         "}
          <button
            className={btnPlayerClaimClassNames}
            onClick={this.claimReward}
            disabled={!this.state.canClaimReward}
          >
            Claim Reward
          </button>
        </div>
      </div>
    );
  };

  GameSection = (
    metamaskInstalled,
    noAccountsInMetamask,
    contractBalance,
    warning,
    k,
    b
  ) => {
    if (metamaskInstalled && !noAccountsInMetamask) {
      return (
        <div>
          <div className="Game-section">
            <div className="Reward-matrix">
              <div style={{ paddingTop: "10px" }}>
                <b>Game Balance is {contractBalance}</b>
                {"                      "}
                <b>{warning}</b>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <b>Reward Factor(K) is {k}</b>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <b>Odd Player Bonus Factor(B) is {b}</b>
              </div>
            </div>
            {this.AdminSection(
              this.state.metamaskAccount,
              this.state.contractOwner
            )}
            <div className="GameState">
              <div>
                <b>{this.state.gameState}</b>
              </div>
              <div>
                <Loading loading={this.state.stateLocalOverride} />
              </div>
            </div>
            <div className="PlayerInput">
              Your address{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                // TODO : Make sure to change domain according to Smart Contract address
                href={
                  "https://rinkeby.etherscan.io/address/" +
                  this.state.metamaskAccount
                }
              >
                {this.state.metamaskAccount}
              </a>
              <div className="bottomMargin">{this.state.preInputText}</div>
              <div className="bottomMargin">
                <AutosizeInput
                  placeholder={this.state.inputPlaceholder}
                  placeholderIsMinWidth
                  autoComplete="off"
                  inputClassName="input"
                  onChange={this.updateInputValue}
                  value={this.state.inputValue}
                />
              </div>
              <div className="bottomMargin">{this.state.postInputText}</div>
            </div>
            {this.PlayerSection()}
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  };

  //DOM
  render = () => {
    //TODO : Can get rid of mulitple ifs and returns

    return (
      <div className="App">
        <MyHeader
          metamaskInstalled={this.state.metamaskInstalled}
          noAccountsInMetamask={this.state.noAccountsInMetamask}
        />
        <hr />
        {this.GameSection(
          this.state.metamaskInstalled,
          this.state.noAccountsInMetamask,
          this.state.contractBalance,
          this.state.warning,
          this.state.k,
          this.state.b
        )}
        <hr />
        <About k={this.state.k} b={this.state.b} />
        <hr />
        <Fair />
      </div>
    );
  };
}

export default App;
