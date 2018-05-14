import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";

//TODO : ETHEREUM_CLIENT usage , can be scoped to file instead of App
//TODO : NO SHOW WHO You are paired other wise people can exploit it
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
    //TODO : Add Fees etc.. game rules
    return (
      <div id="about" className="App-header">
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
          <ul className="App-list">
            <li> X & Y are bet amounts by PlayerX and PlayerY respectively</li>
            <li>K > 1</li>
            <li>B > 1</li>
          </ul>
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
                <li>
                  Reward would be given after deducting Game Fees(F) from Reward
                  amount
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
                href="https://rinkeby.etherscan.io/address/0x2ac77fe38e7be6f3d15f797594aa8d03d8810cea#code"
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
                href="https://rinkeby.etherscan.io/address/0x2ac77fe38e7be6f3d15f797594aa8d03d8810cea"
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
          <div>
            <div>
              <br />
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

class RewardMatrix extends Component {
  render() {
    let { k, gameFees, minBet, maxBet } = this.props;
    return (
      <div className="Reward-matrix">
        <h2>Game Rules</h2>
        <div style={{ paddingTop: "10px" }}>Reward Factor(K) is {k}</div>
        <div style={{ paddingTop: "10px" }}>Game Fees(F) is {gameFees}</div>
        <div style={{ paddingTop: "10px" }}>Minimum Bet is {minBet}</div>
        <div style={{ paddingTop: "10px" }}>Maximum Bet is {maxBet}</div>
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
      k: "being calulated",
      gameFees: "being calculated",
      minBet: "being calculated",
      maxBet: "being calculated",
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
          "0x2ac77fe38e7be6f3d15f797594aa8d03d8810cea"
        ),
        contractAddress: "0x2ac77fe38e7be6f3d15f797594aa8d03d8810cea"
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
        gas: Math.floor(Math.random() * 10000000) + 1
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
        gas: Math.floor(Math.random() * 10000000) + 1
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
        gas: Math.floor(Math.random() * 10000000) + 1
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
        gas: Math.floor(Math.random() * 10000000) + 1
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
    if (this.state.totalGames - this.state.totalGamesFetched === 0) {
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

    this.state.contract.methods
      .getGameState(gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(resultGameState => {
        registerationOpen = resultGameState._registerationOpen;
        revealing = resultGameState._revealing;
        lastGameFinished = resultGameState._lastGameFinished;
        this.state.contract.methods
          .getPlayerState(gameNumber)
          .call({
            from: this.state.metamaskAccount,
            gas: Math.floor(Math.random() * 10000000) + 1
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

  updateGame = gameNumber => {
    console.log("Updating Game " + gameNumber);
    this.setState({
      totalGamesMessage: "Updating game number " + gameNumber.toString()
    });
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

    this.state.contract.methods
      .getGameState(gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.floor(Math.random() * 10000000) + 1
      })
      .then(resultGameState => {
        console.log("Updating game " + gameNumber + " got Game State");
        console.log(resultGameState);
        registerationOpen = resultGameState._registerationOpen;
        revealing = resultGameState._revealing;
        lastGameFinished = resultGameState._lastGameFinished;
        this.state.contract.methods
          .getPlayerState(gameNumber)
          .call({
            from: this.state.metamaskAccount,
            gas: Math.floor(Math.random() * 10000000) + 1
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
              suspended: suspended,
              registered: registered,
              revealed: revealed,
              disqualified: disqualified,
              claimedReward: claimedReward,
              betAmount: betAmount,
              rewardAmount: rewardAmount
            };
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
            this.setState({
              allGames: _allGames,
              allGameBetAmount: _allGameBetAmount,
              allGameChoice: _allGameChoice,
              allGameRevealChoice: _allGameRevealChoice,
              allGameLocalOverride: _allGameLocalOverride,
              allGameMessage: _allGameMessage
            });
          })
          .catch(error => {
            this.updateGame(gameNumber);
          });
      })
      .catch(error => {
        this.updateGame(gameNumber);
      });
  };

  registerPlayerStateListner = () => {
    setInterval(() => {
      this.updateTotalGames();
      this.updateTotalGamesStarted();
      this.updateTotalGamesJoined();
    }, 2000);
  };

  registerStateListener = () => {
    setInterval(() => {
      this.state.contract.methods
        .getContractBalance()
        .call({
          from: this.state.metamaskAccount,
          gas: Math.floor(Math.random() * 10000000) + 1
        })
        .then(balance => {
          this.state.contract.methods
            .getRewardMatrix()
            .call({
              from: this.state.metamaskAccount,
              gas: Math.floor(Math.random() * 10000000) + 1
            })
            .then(rewardFactor => {
              this.state.contract.methods
                .getGameRules()
                .call({
                  from: this.state.metamaskAccount,
                  gas: Math.floor(Math.random() * 10000000) + 1
                })
                .then(result => {
                  this.setState({
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
                        .toString() + " ether"
                  });
                });
            });
        });
    }, 2000);
  };

  //ADMIN METHODS START
  fundContract() {
    return () => {
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
  }

  withdraw() {
    return () => {
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
          this.updateGame(gameNumber);
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
          this.updateGame(gameNumber);
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
          this.updateGame(gameNumber);
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
            <div>
              <button className="button-admin-enabled" onClick={this.withdraw}>
                Withdraw
              </button>
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
    return (
      <div className="NewGame">
        <div>
          <h1>
            <b>Create a new game</b>
          </h1>
        </div>
        <div class="Inline">
          <div>
            <AutosizeInput
              placeholder="Enter your bet amount in ETH."
              inputClassName="game-input"
              onChange={this.updateStartGameBetAmount}
              value={this.state.startGameBetAmount}
            />
          </div>
          {" ETH"}
        </div>
        <div className="Inline">
          <div>
            <AutosizeInput
              placeholder="Enter your choice."
              inputClassName="game-input"
              onChange={this.updateStartGameChoice}
              value={this.state.startGameChoice}
            />
          </div>
          {" ODD for SPLIT / EVEN for STEAL"}
        </div>

        <br />
        <div>
          <button className="button-player-enabled" onClick={this.startGame()}>
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
      if (game.registerationOpen) {
        if (game.registered) {
          if (game.claimedReward) {
            gameState = "You abondoned game.";
          } else {
            gameState = "Waiting for someone to join the game.";
            cta = (
              <button
                className="button-player-enabled"
                onClick={this.claimReward(gameNumber)}
              >
                Abandon Game
              </button>
            );
          }
        } else {
          gameState = "Place your Bet.";
          cta = (
            <button
              className="button-player-enabled"
              onClick={this.joinGame(gameNumber)}
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
          gameState = "Reveal your choice.";
          gameSubstate = "Enter Previously entered choice.";
          cta = cta = (
            <button
              className="button-player-enabled"
              onClick={this.reveal(
                gameNumber,
                this.state.allGameRevealChoice[gameNumber]
              )}
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
              className="button-player-enabled"
              onClick={this.claimReward(game.gameNumber)}
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
    return (
      <div className="AllGames">
        <div className="bottomMargin">
          <h2>
            <b>All Games</b>
          </h2>
        </div>
        <div className="bottomMargin">{this.state.totalGamesMessage}</div>
        <div className="bottomMargin">{games}</div>
        <div>
          {this.state.totalGames !== 0 ? (
            <button
              className="button-more-games"
              onClick={this.userAddToAllGames}
            >
              {" "}
              Get More Games
            </button>
          ) : (
            <div />
          )}
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

          <div class="Inline">
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
            <RewardMatrix
              contractBalance={this.state.contractBalance}
              k={this.state.k}
              gameFees={this.state.gameFees}
              minBet={this.state.minBet}
              maxBet={this.state.maxBet}
            />
            {this.AdminSection(
              this.state.metamaskAccount,
              this.state.contractOwner
            )}
            {this.NewGame()}
            {this.AllGames()}
          </div>
          <hr />
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
