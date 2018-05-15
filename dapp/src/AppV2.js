import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";

//TODO : CssTransitionGroup Animation
//TODO : Add Animation for EVEN STEAL and odd SPLIT

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
    let { k } = this.props;
    return (
      <div id="about">
        <div className="App-about">
          <b>
            <h2>What is the game?</h2>
          </b>
          It is a two player game(X, Y) where each player is asked to bet some
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
                <th>Disqualified</th>
              </tr>
              <tr>
                <td>
                  <b>Split</b>
                </td>
                <td>(X+Y)/2</td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>Min(X+Y, K*X) \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>Steal</b>
                </td>
                <td>Min(X+Y, K*X) \ 0</td>
                <td>Min(X+Y, K*Max(0,X-Y))</td>
                <td>Min(X+Y, K*X) \ 0</td>
              </tr>
              <tr>
                <td>
                  <b>Disqualified</b>
                </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ Min(X+Y, K*Y) </td>
                <td>0 \ 0</td>
              </tr>
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
                K > 1, K is <b>Reward Factor</b>
              </li>
            </ul>
          </div>
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
            R(X,Y,K) => R({this.state.X}, {this.state.Y}, {k})
          </b>
          <br />
          <table className="App-table">
            <tbody>
              <tr>
                <th>(Me \ Opponent)</th>
                <th>Split</th>
                <th>Steal</th>
                <th>Disqualified</th>
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
              </tr>
            </tbody>
          </table>
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
                    <li>Either by starting a new game.</li>
                    <li>Or by Joining an exiting game.</li>
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
      </div>
    );
  }
}

class Fair extends Component {
  render() {
    return (
      <div id="how-provably-fair" className="App-about">
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
                href="https://rinkeby.etherscan.io/address/0x65fb55676278a460f002aa98b59718bfe6cd9078#code"
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
                href="https://rinkeby.etherscan.io/address/0x65fb55676278a460f002aa98b59718bfe6cd9078"
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
            to play the game.
          </h2>
        )}

        {coins}
        {!metamaskInstalled || noAccountsInMetamask ? null : (
          <div>
            <div>
              <br />
              <a href="#about">
                <h2>
                  <b>How to play this game ?</b>
                </h2>
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

class RewardMatrix extends Component {
  render() {
    let { k, gameFees, minBet, maxBet, stageTimeout } = this.props;
    return (
      <div className="Reward-matrix">
        <h3>Game Rules</h3>
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

class AppV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Global State
      web3: null,
      contractBalance: "being calculated",
      contractEarnings: "being calculated",
      k: "being calulated",
      gameFees: "being calculated",
      minBet: "being calculated",
      maxBet: "being calculated",
      stageTimout: "being calculated",
      contractOwner: null,
      metamaskAccount: null,
      metamaskInstalled: false,
      noAccountsInMetamask: true,
      contract: null,
      totalGames: 0,
      totalGamesFetched: 0,
      totalGamesMessage: "",
      //Admin
      fundValue: "",
      adminStateOverride: "",
      adminStateMessage: "",
      //Player
      totalGamesStarted: 0,
      totalGamesJoined: 0,
      //Player Start Game
      startGameBetAmount: "",
      startGameChoice: "",
      startGameLocalOverride: false,
      startGameMessage: "",
      //All Games
      userOverrideMoreGame: false,
      maxAutoFetchGames: 5,
      allGames: {},
      allGameBetAmount: {},
      allGameChoice: {},
      allGameRevealChoice: {},
      allGameLocalOverride: {},
      allGameMessage: {}
    };
  }

  componentWillMount = () => {
    console.log("componentWillMount");
    if (typeof window.web3 !== "undefined") {
      let web3 = new Web3(window.web3.currentProvider);
      this.setState({
        web3: web3
      });
      console.log(web3);
      this.setState({
        contract: new web3.eth.Contract(
          abi,
          "0x65fb55676278a460f002aa98b59718bfe6cd9078"
        ),
        contractAddress: "0x65fb55676278a460f002aa98b59718bfe6cd9078"
      });
      //Check if metamask is installed/enabled
      if (web3.currentProvider.isMetaMask) {
        this.setState({
          metamaskInstalled: true
        });
        web3.eth.getAccounts((error, accounts) => {
          if (accounts.length === 0) {
            console.error("No Accounts in Metamask");
          } else {
            console.log("Account found in Metamask");
            this.setState({
              noAccountsInMetamask: false,
              metamaskAccount: accounts[0]
            });
          }
          if (
            this.state.metamaskInstalled &&
            !this.state.noAccountsInMetamask
          ) {
            console.log("Calling Init.");
            this.setContractOwner();
          } else {
            console.error("Not calling Init.");
            console.error(this.state.metamaskInstalled);
            console.error(!this.state.noAccountsInMetamask);
          }
        });
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
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(result => {
        this.setState({
          contractOwner: result
        });
        console.log("Contract Owner : " + result);
        this.registerMetamaskAddressChangeListner();
        this.registerStateListener();
        this.registerPlayerStateListner();
      });
  };

  registerMetamaskAddressChangeListner = () => {
    setInterval(() => {
      this.state.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          return;
        }
        if (accounts.length === 0) {
          this.setState({
            noAccountsInMetamask: true
          });
          return;
        } else {
          if (this.state.noAccountsInMetamask) {
            this.setState({
              noAccountsInMetamask: false
            });
            console.log("Metamask Account Logged In");
          }
        }
        if (this.state.metamaskAccount !== accounts[0]) {
          this.setState({
            metamaskAccount: accounts[0],
            totalGamesFetched: 0,
            allGames: {},
            allGameBetAmount: {},
            allGameChoice: {},
            allGameRevealChoice: {},
            allGameLocalOverride: {},
            allGameMessage: {}
          });
          this.addToAllGames();
          console.log("Metamask Account Changed");
        }
      });
    }, 2000);
  };

  updateTotalGames = () => {
    this.state.contract.methods
      .getTotalGames()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(result => {
        console.log("Total Games from Contract " + result);
        let _totalGamesMessage = this.state.totalGamesMessage;
        if (parseInt(result, 10) === 0) {
          _totalGamesMessage = "No Games have been played yet.";
        }
        if (this.state.totalGames < result) {
          _totalGamesMessage = "Found new Game(s), Fetching....";
          this.setState({
            totalGames: parseInt(result, 10),
            totalGamesMessage: _totalGamesMessage,
            totalGamesFetched: 0,
            allGames: {},
            allGameBetAmount: {},
            allGameChoice: {},
            allGameRevealChoice: {},
            allGameLocalOverride: {},
            allGameMessage: {}
          });
        } else {
          this.setState({
            totalGames: parseInt(result, 10),
            totalGamesMessage: _totalGamesMessage
          });
        }
        this.addToAllGames();
      });
  };

  updateTotalGamesStarted = () => {
    this.state.contract.methods
      .getTotalGamesStarted()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(result => {
        this.setState({
          totalGamesStarted: parseInt(result, 10)
        });
      });
  };

  updateTotalGamesJoined = () => {
    this.state.contract.methods
      .getTotalGamesParticipated()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(result => {
        this.setState({
          totalGamesJoined: parseInt(result, 10)
        });
      });
  };

  addToAllGames = () => {
    console.log("total games " + this.state.totalGames);
    console.log("total games fetched " + this.state.totalGamesFetched);
    if (this.state.totalGames - this.state.totalGamesFetched <= 0) {
      console.log("No games to fetch");
      if (this.state.totalGames !== 0) {
        this.setState({
          totalGamesMessage: "All Games have been fetched."
        });
      }
      return;
    }
    let _allGames = this.state.allGames;
    let _totalGamesFetched = this.state.totalGamesFetched;
    let gameNumber = this.state.totalGames - this.state.totalGamesFetched;

    if (
      this.state.totalGamesFetched !== 0 &&
      this.state.totalGamesFetched % this.state.maxAutoFetchGames === 0
    ) {
      if (!this.state.userOverrideMoreGame) {
        this.setState({
          totalGamesMessage:
            "Click on 'Get More Games' to fetch previous games."
        });
        return;
      }
    }
    console.log("Fetching game number " + gameNumber);
    this.setState({
      totalGamesMessage: "Fetching game number " + gameNumber.toString()
    });
    let registerationOpen = false;
    let revealing = false;
    let lastGameFinished = false;
    let suspended = false;
    let registered = false;
    let revealed = false;
    let disqualified = false;
    let claimedReward = false;
    let betAmount = 0;
    let rewardAmount = 0;
    let startTime = 0;
    let revealTime = 0;
    let finishTime = 0;

    this.state.contract.methods
      .getGameState(gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(resultGameState => {
        registerationOpen = resultGameState._registerationOpen;
        revealing = resultGameState._revealing;
        lastGameFinished = resultGameState._lastGameFinished;
        startTime = resultGameState._startTime;
        revealTime = resultGameState._revealTime;
        finishTime = resultGameState._finishTime;
        this.state.contract.methods
          .getPlayerState(gameNumber)
          .call({
            from: this.state.metamaskAccount,
            gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
          })
          .then(resultPlayerState => {
            suspended = resultPlayerState._suspended;
            registered = resultPlayerState._registered;
            revealed = resultPlayerState._revealed;
            disqualified = resultPlayerState._disqualified;
            claimedReward = resultPlayerState._claimedReward;
            betAmount = resultPlayerState._betAmount;
            rewardAmount = resultPlayerState._reward;
            _allGames[gameNumber] = {
              gameNumber: gameNumber,
              registerationOpen: registerationOpen,
              revealing: revealing,
              lastGameFinished: lastGameFinished,
              startTime: startTime,
              revealTime: revealTime,
              finishTime: finishTime,
              suspended: suspended,
              registered: registered,
              revealed: revealed,
              disqualified: disqualified,
              claimedReward: claimedReward,
              betAmount: betAmount,
              rewardAmount: rewardAmount
            };
            _totalGamesFetched = _totalGamesFetched + 1;
            let _allGameBetAmount = this.state.allGameBetAmount;
            _allGameBetAmount[gameNumber] = "";
            let _allGameChoice = this.state.allGameChoice;
            _allGameChoice[gameNumber] = "";
            let _allGameRevealChoice = this.state.allGameRevealChoice;
            _allGameRevealChoice[gameNumber] = "";
            let _allGameLocalOverride = this.state.allGameLocalOverride;
            _allGameLocalOverride[gameNumber] = false;
            let _allGameMessage = this.state.allGameMessage;
            _allGameMessage[gameNumber] = "";
            console.log("Setting... All Games.");
            let _totalGamesMessage = this.state.totalGamesMessage;
            if (gameNumber > 1) {
              if (_totalGamesFetched % this.state.maxAutoFetchGames === 0) {
                _totalGamesMessage =
                  "Click on 'Get More Games' to fetch previous games.";
              } else {
                _totalGamesMessage = "Fetching game number " + (gameNumber - 1);
              }
            } else {
              _totalGamesMessage = "All Games have been fetched.";
            }
            let _userOverrideMoreGame = this.state.userOverrideMoreGame;
            if (_userOverrideMoreGame) {
              _userOverrideMoreGame = false;
            }
            this.setState({
              allGames: _allGames,
              userOverrideMoreGame: _userOverrideMoreGame,
              totalGamesMessage: _totalGamesMessage,
              totalGamesFetched: _totalGamesFetched,
              allGameBetAmount: _allGameBetAmount,
              allGameChoice: _allGameChoice,
              allGameRevealChoice: _allGameRevealChoice,
              allGameLocalOverride: _allGameLocalOverride,
              allGameMessage: _allGameMessage
            });
          });
      });
  };

  userAddToAllGames = () => {
    this.setState({
      userOverrideMoreGame: true
    });
    this.addToAllGames();
  };

  updateGame = (gameNumber, tellUser) => {
    console.log("Updating Game " + gameNumber);
    if (tellUser) {
      this.setState({
        totalGamesMessage: "Updating game number " + gameNumber.toString()
      });
    }
    let _allGames = this.state.allGames;
    let registerationOpen = false;
    let revealing = false;
    let lastGameFinished = false;
    let suspended = false;
    let registered = false;
    let revealed = false;
    let disqualified = false;
    let claimedReward = false;
    let betAmount = 0;
    let rewardAmount = 0;
    let startTime = 0;
    let revealTime = 0;
    let finishTime = 0;

    this.state.contract.methods
      .getGameState(gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(resultGameState => {
        console.log("Updating game " + gameNumber + " got Game State");
        console.log(resultGameState);
        registerationOpen = resultGameState._registerationOpen;
        revealing = resultGameState._revealing;
        lastGameFinished = resultGameState._lastGameFinished;
        startTime = resultGameState._startTime;
        revealTime = resultGameState._revealTime;
        finishTime = resultGameState._finishTime;

        this.state.contract.methods
          .getPlayerState(gameNumber)
          .call({
            from: this.state.metamaskAccount,
            gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
          })
          .then(resultPlayerState => {
            console.log("Updating game " + gameNumber + " got Player State");
            console.log(resultPlayerState);
            suspended = resultPlayerState._suspended;
            registered = resultPlayerState._registered;
            revealed = resultPlayerState._revealed;
            disqualified = resultPlayerState._disqualified;
            claimedReward = resultPlayerState._claimedReward;
            betAmount = resultPlayerState._betAmount;
            rewardAmount = resultPlayerState._reward;
            _allGames[gameNumber] = {
              gameNumber: gameNumber,
              registerationOpen: registerationOpen,
              revealing: revealing,
              lastGameFinished: lastGameFinished,
              startTime: startTime,
              revealTime: revealTime,
              finishTime: finishTime,
              suspended: suspended,
              registered: registered,
              revealed: revealed,
              disqualified: disqualified,
              claimedReward: claimedReward,
              betAmount: betAmount,
              rewardAmount: rewardAmount
            };
            let _allGameLocalOverride = this.state.allGameLocalOverride;
            let _allGameMessage = this.state.allGameMessage;
            if (tellUser) {
              _allGameLocalOverride[gameNumber] = false;
              _allGameMessage[gameNumber] = "";
            }
            console.log("Setting... All Games.");
            this.setState({
              allGames: _allGames,
              allGameLocalOverride: _allGameLocalOverride,
              allGameMessage: _allGameMessage
            });
          });
      });
  };

  registerPlayerStateListner = () => {
    setInterval(() => {
      this.updateTotalGames();
      this.updateTotalGamesStarted();
      this.updateTotalGamesJoined();
      let totalGames = this.state.totalGames;
      let totalGamesFetched = this.state.totalGamesFetched;
      for (
        let i = totalGames;
        i > totalGames - totalGamesFetched && i > 0;
        i--
      ) {
        try {
          this.updateGame(i, false);
        } catch (ignore) {}
      }
    }, 2000);
  };

  registerStateListener = () => {
    setInterval(() => {
      this.state.contract.methods
        .getContractEarnings()
        .call({
          from: this.state.metamaskAccount,
          gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
        })
        .then(earnings => {
          this.state.contract.methods
            .getContractBalance()
            .call({
              from: this.state.metamaskAccount,
              gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
            })
            .then(balance => {
              this.state.contract.methods
                .getRewardMatrix()
                .call({
                  from: this.state.metamaskAccount,
                  gas: Math.min(
                    Math.floor(Math.random() * 10000000) + 1,
                    210000
                  )
                })
                .then(rewardFactor => {
                  this.state.contract.methods
                    .getGameRules()
                    .call({
                      from: this.state.metamaskAccount,
                      gas: Math.min(
                        Math.floor(Math.random() * 10000000) + 1,
                        210000
                      )
                    })
                    .then(result => {
                      this.setState({
                        contractEarnings:
                          this.state.web3.utils
                            .fromWei(earnings, "ether")
                            .toString() + " ether",
                        contractBalance:
                          this.state.web3.utils
                            .fromWei(balance, "ether")
                            .toString() + " ether",
                        k: parseFloat(
                          (parseInt(rewardFactor, 10) + 100) / 100
                        ).toString(),
                        gameFees:
                          this.state.web3.utils
                            .fromWei(result._fees, "ether")
                            .toString() + " ether",
                        minBet:
                          this.state.web3.utils
                            .fromWei(result._minBet, "ether")
                            .toString() + " ether",
                        maxBet:
                          this.state.web3.utils
                            .fromWei(result._maxBet, "ether")
                            .toString() + " ether",
                        stageTimout:
                          (
                            parseInt(result._stageTimeout, 10) /
                            (60 * 60 * 24)
                          ).toString() + " days"
                      });
                    });
                });
            });
        });
    }, 2000);
  };

  //ADMIN METHODS START
  fundContract = () => {
    let fundInWei = this.state.web3.utils.toWei(
      (parseFloat(this.state.fundValue) * 1e18).toString(),
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

  withdraw() {
    return () => {
      let transaction = this.state.contract.methods.transferEarningsToOwner();
      transaction
        .send({
          from: this.state.metamaskAccount
        })
        .on("transactionHash", hash => {
          this.setState({
            adminStateOverride: true,
            adminStateMessage: "Withdrawing Earnings....."
          });
          console.log(
            "Your request for withdraw earnings has been submitted. "
          );
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log(
            "You request has got " + confirmationNumber + " confirmations"
          );
        })
        .on("receipt", receipt => {
          console.log(receipt);
          this.setState({
            adminStateOverride: false,
            adminStateMessage: ""
          });
        });
    };
  }
  //ADMIN METHODS ENDS

  //User interaction Methods
  startGame() {
    return () => {
      let betInWei = this.state.web3.utils.toWei(
        (parseFloat(this.state.startGameBetAmount) * 1e18).toString(),
        "wei"
      );

      //That's how you calculate keccak256 from DApp and send to Smart contract
      let encryptedChoice = new Web3(
        window.web3.currentProvider
      ).utils.soliditySha3(parseInt(this.state.startGameChoice, 10));

      let transaction = this.state.contract.methods.startGame(
        betInWei,
        encryptedChoice
      );

      transaction
        .send({
          from: this.state.metamaskAccount,
          value: betInWei
        })
        .on("transactionHash", hash => {
          this.setState({
            startGameLocalOverride: true,
            startGameMessage: "Your new game is being created...."
          });
          console.log(
            "Your request for start registration has been submitted. "
          );
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log(
            "You request has got " + confirmationNumber + " confirmations"
          );
        })
        .on("receipt", receipt => {
          console.log(receipt);
          this.setState({
            startGameLocalOverride: false,
            startGameMessage: "",
            totalGamesFetched: 0,
            allGames: {},
            allGameBetAmount: {},
            allGameChoice: {},
            allGameRevealChoice: {},
            allGameLocalOverride: {},
            allGameMessage: {}
          });
          this.addToAllGames();
        });
    };
  }

  joinGame(gameNumber) {
    return () => {
      let betInWei = this.state.web3.utils.toWei(
        (parseFloat(this.state.allGameBetAmount[gameNumber]) * 1e18).toString(),
        "wei"
      );

      //That's how you calculate keccak256 from DApp and send to Smart contract
      let encryptedChoice = new Web3(
        window.web3.currentProvider
      ).utils.soliditySha3(parseInt(this.state.allGameChoice[gameNumber], 10));

      let transaction = this.state.contract.methods.joinGame(
        parseInt(gameNumber, 10),
        betInWei,
        encryptedChoice
      );

      transaction
        .send({
          from: this.state.metamaskAccount,
          value: betInWei
        })
        .on("transactionHash", hash => {
          let _allGameLocalOverride = this.state.allGameLocalOverride;
          _allGameLocalOverride[gameNumber] = true;

          let _allGameMessage = this.state.allGameMessage;
          _allGameMessage[gameNumber] = "Your bet is being submitted....";
          this.setState({
            allGameLocalOverride: _allGameLocalOverride,
            allGameMessage: _allGameMessage
          });
          console.log("Your request for bet has been submitted.");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log(
            "You request has got " + confirmationNumber + " confirmations"
          );
        })
        .on("receipt", receipt => {
          console.log(receipt);
          this.updateGame(gameNumber, true);
        });
    };
  }

  //TODO Accept form which node got it.
  reveal(gameNumber, choice) {
    return () => {
      let transaction = this.state.contract.methods.reveal(
        parseInt(gameNumber, 10),
        parseInt(choice, 10)
      );

      transaction
        .send({
          from: this.state.metamaskAccount
        })
        .on("transactionHash", hash => {
          let _allGameLocalOverride = this.state.allGameLocalOverride;
          _allGameLocalOverride[gameNumber] = true;

          let _allGameMessage = this.state.allGameMessage;
          _allGameMessage[gameNumber] =
            "Your revealed choice has been submitted....";

          this.setState({
            allGameLocalOverride: _allGameLocalOverride,
            allGameMessage: _allGameMessage
          });
          console.log("Your request for revealing choice has been submitted.");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log(
            "You request has got " + confirmationNumber + " confirmations"
          );
        })
        .on("receipt", receipt => {
          console.log(receipt);
          this.updateGame(gameNumber, true);
        });
    };
  }

  claimReward(gameNumber) {
    return () => {
      let transaction = this.state.contract.methods.claimRewardK(
        parseInt(gameNumber, 10)
      );

      transaction
        .send({
          from: this.state.metamaskAccount
        })
        .on("transactionHash", hash => {
          let _allGameLocalOverride = this.state.allGameLocalOverride;
          _allGameLocalOverride[gameNumber] = true;

          let _allGameMessage = this.state.allGameMessage;
          if (this.state.allGames[gameNumber].registerationOpen) {
            _allGameMessage[gameNumber] = "Your game is being abandoned....";
          } else {
            _allGameMessage[gameNumber] = "Your claim has been submitted....";
          }
          this.setState({
            allGameLocalOverride: _allGameLocalOverride,
            allGameMessage: _allGameMessage
          });

          console.log("Your request has been submitted");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log(
            "You request has got " + confirmationNumber + " confirmations"
          );
        })
        .on("receipt", receipt => {
          console.log(receipt);
          this.updateGame(gameNumber, true);
        });
    };
  }

  updateFundValue = event => {
    const val = event.target.value;
    this.setState({
      fundValue: val
    });
  };

  updateStartGameBetAmount = event => {
    const val = event.target.value;
    this.setState({
      startGameBetAmount: val
    });
  };

  updateStartGameChoice = event => {
    const val = event.target.value;
    this.setState({
      startGameChoice: val
    });
  };

  AdminSection = (metamaskAccount, contractOwner) => {
    if (metamaskAccount === contractOwner) {
      let disbaled =
        this.state.adminStateOverride ||
        this.state.contractEarnings === "being calculated" ||
        this.state.contractEarnings === "0 ether";
      let className = disbaled ? "button-admin" : "button-admin-enabled";
      return (
        <div className="Admin">
          <div>
            <h2>
              <b>Game Admin Controls</b>
            </h2>
          </div>
          <div>
            <div className="bottomMargin">
              Game Balance is {this.state.contractBalance}
            </div>
            <div className="bottomMargin">
              Game Earnigs are {this.state.contractEarnings}
            </div>
            <div>
              <button
                className={className}
                onClick={this.withdraw()}
                disabled={disbaled}
              >
                Withdraw Earnings
              </button>
            </div>

            <div>{this.state.adminStateMessage}</div>
            <div>
              <Loading loading={this.state.adminStateOverride} />
            </div>
          </div>
        </div>
      );
    }
  };

  Player = () => {
    return (
      <div className="Player">
        Your address{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          // TODO : Make sure to change domain according to Smart Contract address
          href={
            "https://rinkeby.etherscan.io/address/" + this.state.metamaskAccount
          }
        >
          {this.state.metamaskAccount}
        </a>
      </div>
    );
  };

  NewGame = () => {
    let className = this.state.startGameLocalOverride
      ? "button-player"
      : "button-player-enabled";
    return (
      <div className="NewGame">
        <div>
          <h2>
            <b>Create a new game</b>
          </h2>
        </div>
        <div>
          <div>
            <AutosizeInput
              placeholder="Enter your bet amount."
              inputClassName="game-input"
              onChange={this.updateStartGameBetAmount}
              value={this.state.startGameBetAmount}
            />
          </div>
          {" ETH"}
        </div>
        <div>
          <div>
            <AutosizeInput
              placeholder="You want to Split or Steal."
              inputClassName="game-input"
              onChange={this.updateStartGameChoice}
              value={this.state.startGameChoice}
            />
          </div>
          {" ODD number for SPLIT / EVEN number for STEAL"}
        </div>

        <div>
          <button
            className={className}
            onClick={this.startGame()}
            disabled={this.state.startGameLocalOverride}
          >
            Start Game
          </button>
        </div>

        <div>{this.state.startGameMessage}</div>
        <div>
          <Loading loading={this.state.startGameLocalOverride} />
        </div>
      </div>
    );
  };

  AllGames = () => {
    let games = [];
    let totalGames = this.state.totalGames;
    let totalGamesFetched = this.state.totalGamesFetched;
    for (let i = totalGames; i > totalGames - totalGamesFetched && i > 0; i--) {
      let game = this.state.allGames[i];
      let gameNumber = game.gameNumber;
      let gameState = "";
      let gameSubstate =
        parseInt(game.betAmount, 10) === 0
          ? ""
          : "You bet " +
            this.state.web3.utils
              .fromWei(game.betAmount.toString(), "ether")
              .toString() +
            " ether.";

      let reward =
        this.state.web3.utils
          .fromWei(game.rewardAmount.toString(), "ether")
          .toString() + " ether.";

      let cta = null;
      let input = null;
      let sinceStart = "";
      let sinceReveal = "";
      let sinceFinished = "";
      let disabled = this.state.allGameLocalOverride[gameNumber];
      let classNameGame = disabled ? "button-player" : "button-player-enabled";
      if (game.registerationOpen) {
        sinceStart =
          "Game Started on " +
          new Date(parseInt(game.startTime, 10) * 1000).toString();
        if (game.registered) {
          if (game.claimedReward) {
            gameState = "You abondoned game.";
          } else {
            gameState = "Waiting for someone to join the game.";
            cta = (
              <button
                className={classNameGame}
                onClick={this.claimReward(gameNumber)}
                disabled={disabled}
              >
                Abandon Game
              </button>
            );
          }
        } else {
          gameState = "Place your Bet.";
          cta = (
            <button
              className={classNameGame}
              onClick={this.joinGame(gameNumber)}
              disabled={disabled}
            >
              Join Game
            </button>
          );
          input = input = (
            <div>
              <div>
                <AutosizeInput
                  placeholder="Enter your bet amount in ETH."
                  inputClassName="game-input"
                  onChange={event => {
                    const val = event.target.value;
                    let _allGameBetAmount = this.state.allGameBetAmount;
                    _allGameBetAmount[gameNumber] = val;
                    this.setState({
                      allGameBetAmount: _allGameBetAmount
                    });
                  }}
                  value={this.state.allGameBetAmount[gameNumber]}
                />
              </div>
              {" ETH"}
              <br />
              <br />
              <div>
                <AutosizeInput
                  placeholder="Enter your choice."
                  inputClassName="game-input"
                  onChange={event => {
                    const val = event.target.value;
                    let _allGameChoice = this.state.allGameChoice;
                    _allGameChoice[gameNumber] = val;
                    this.setState({
                      allGameChoice: _allGameChoice
                    });
                  }}
                  value={this.state.allGameChoice[gameNumber]}
                />
              </div>
              {" ODD for SPLIT / EVEN for STEAL"}
            </div>
          );
        }
      }
      if (game.revealing) {
        sinceStart =
          "Game Started on " +
          new Date(parseInt(game.startTime, 10) * 1000).toString();
        sinceReveal =
          "Reveal Round Started on " +
          new Date(parseInt(game.revealTime, 10) * 1000).toString();
        if (!game.registered) {
          gameState = "You cannot play this game. This is";
          gameSubstate = "being played by some other people.";
        } else if (game.revealed) {
          if (game.disqualified) {
            gameState = "Your are disqualified.";
          } else {
            gameState = "Waiting for opponent to reveal choice.";
          }
        } else {
          gameState = "Reveal your previously entered choice.";
          gameSubstate = "ODD number for SPLIT / EVEN number for STEAL";
          cta = cta = (
            <button
              className={classNameGame}
              onClick={this.reveal(
                gameNumber,
                this.state.allGameRevealChoice[gameNumber]
              )}
              disabled={disabled}
            >
              Reveal
            </button>
          );
          input = (
            <AutosizeInput
              placeholder="Reveal your choice."
              inputClassName="game-input"
              onChange={event => {
                const val = event.target.value;
                let _allGameRevealChoice = this.state.allGameRevealChoice;
                _allGameRevealChoice[gameNumber] = val;
                this.setState({
                  allGameRevealChoice: _allGameRevealChoice
                });
              }}
              value={this.state.allGameRevealChoice[gameNumber]}
            />
          );
        }
      }
      if (game.lastGameFinished) {
        sinceStart =
          "Game Started on " +
          new Date(parseInt(game.startTime, 10) * 1000).toString();
        sinceReveal =
          "Reveal Round Started on " +
          new Date(parseInt(game.revealTime, 10) * 1000).toString();
        sinceFinished =
          "Game finished on " +
          new Date(parseInt(game.finishTime, 10) * 1000).toString();
        gameState = "This game is finished.";
        if (!game.registered) {
          gameSubstate = "You did not play this game.";
        } else if (game.disqualified) {
          gameState = "Your got disqualified.";
        } else if (game.claimedReward) {
          gameState = "You have claimed your reward.";
          gameSubstate = gameSubstate + " You won " + reward;
        } else {
          gameState = "Claim your reward";
          cta = (
            <button
              className={classNameGame}
              onClick={this.claimReward(game.gameNumber)}
              disabled={disabled}
            >
              Claim Reward
            </button>
          );
        }
      }

      games.push(
        <div key={i} className="AllGamesCard">
          <div>
            <h3>
              <b>GAME NUMBER {game.gameNumber}</b>
            </h3>
            <div>{sinceStart}</div>
            <div>{sinceReveal}</div>
            <div>{sinceFinished}</div>
          </div>
          <br />
          <div>{gameState}</div>
          <br />
          <div>{gameSubstate}</div>
          <div>{input}</div>
          <div>{cta}</div>
          <div>
            <Loading loading={this.state.allGameLocalOverride[gameNumber]} />
          </div>
          <div>{this.state.allGameMessage[gameNumber]}</div>
        </div>
      );
    }
    let disbaledMoreGames =
      this.state.totalGames === 0 ||
      this.state.totalGames - this.state.totalGamesFetched <= 0;
    let className = disbaledMoreGames
      ? "button-more-games"
      : "button-more-games-enabled";
    return (
      <div>
        <div className="AllGames">
          <div className="bottomMargin">{games}</div>
          <h2>
            <b>All Games</b>
          </h2>
          <div className="bottomMargin">{this.state.totalGamesMessage}</div>
          <div>
            <button
              className={className}
              onClick={this.userAddToAllGames}
              disabled={disbaledMoreGames}
            >
              {" "}
              Get More Games
            </button>
          </div>
        </div>
      </div>
    );
  };

  Donate = (metamaskInstalled, noAccountsInMetamask) => {
    if (metamaskInstalled && !noAccountsInMetamask) {
      return (
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
                onChange={this.updateFundValue}
                value={this.state.fundValue}
              />{" "}
            </div>

            <button
              className="button-donation-enabled"
              onClick={this.fundContract}
            >
              <b>Donate</b>
            </button>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  };

  GameSection = () => {
    if (this.state.metamaskInstalled && !this.state.noAccountsInMetamask) {
      return (
        <div>
          <div className="Game-section">
            {this.Player()}
            {this.AdminSection(
              this.state.metamaskAccount,
              this.state.contractOwner
            )}
            <div className="Game-section">
              <RewardMatrix
                contractBalance={this.state.contractBalance}
                k={this.state.k}
                gameFees={this.state.gameFees}
                minBet={this.state.minBet}
                maxBet={this.state.maxBet}
                stageTimeout={this.state.stageTimout}
              />
              {this.NewGame()}
            </div>
            {this.AllGames()}
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
        {this.GameSection()}
        <About k={this.state.k} />
        <Fair />
        <div className="Footer">
          {this.Donate(
            this.state.metamaskInstalled,
            this.state.noAccountsInMetamask
          )}
          <br />
          <br />
          {"©2018 Rajat Mathur. All Rights Reserved."}
          <br />
          <br />
          {"       "}
        </div>
      </div>
    );
  };
}

export default AppV2;
