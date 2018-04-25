import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";

//TODO : ETHEREUM_CLIENT usage , can be scoped to file instead of App
//TODO : NO SHOW WHO You are paired other wise people can exploit it
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
      </header>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Global State
      contractOwner: null,
      metamaskAccount: null,
      metamaskInstalled: false,
      noAccountsInMetamask: true,
      contract: null,
      //Game State Variables
      currentGame: 0,
      gameState: "No game is live currently.",
      //Player Variables
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
      let newClient = new Web3(window.web3.currentProvider);
      console.log(
        new newClient.eth.Contract(
          abi,
          "0xe7f457d41ad107faf0a3622306b0224dd6f97a0e"
        )
      );
      this.setState({
        contract: new client.eth.Contract(
          abi,
          "0xe7f457d41ad107faf0a3622306b0224dd6f97a0e"
        )
      });
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

  //TODO : Use Web Method instead of this one
  leftpad = (str, len, ch) => {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = " ";
    len = len - str.length;
    while (++i < len) {
      str = ch + str;
    }
    return str;
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
            metamaskAccount: accounts[0]
          });
          window.location.reload();
        }
      });
    }, 2000);
  };

  setPlayerState = (stateChange, currentGameState) => {
    if (this.state.currentGame <= 0) {
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
        let suspended = result._suspended;
        let registered = result._registered;
        let played = result._played;
        let revealed = result._revealed;
        let disqualified = result._disqualified;
        let claimedReward = result._claimedReward;
        let opponent = result._opponent;
        let betAmount = result._betAmount;
        //TODO : REMOVE THIS
        let opponentBetAmount = result._opponentBetAmount;

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
          console.log("Claimed Reward");
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: false,
            preInputText: "Wait for next game to bet.",
            inputPlaceholder: "Not accepting any bets",
            postInputText: "",
            gameState:
              stateChange["gameState"] +
              " You have already claimed reward for Game " +
              this.state.currentGame
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
            gameState: currentGameState._revealing
              ? " You have been disqualified for Game " +
                this.state.currentGame +
                " You had bet " +
                parseInt(betAmount, 10) +
                " wei"
              : stateChange["gameState"] +
                " You have been disqualified for Game " +
                this.state.currentGame +
                " You had bet " +
                parseInt(betAmount, 10) +
                " wei"
          });
        } else if (revealed) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: false,
            canClaimReward: currentGameState._revealing ? false : true,
            preInputText: "Wait for next game to bet.",
            inputPlaceholder: "Not accepting any bets",
            postInputText: "",
            gameState: currentGameState._revealing
              ? "Wait for Game " +
                this.state.currentGame +
                " to be finished to claim reward" +
                " You had bet " +
                parseInt(betAmount, 10)
              : "Claim your reward for Game " +
                this.state.currentGame +
                " You had bet " +
                parseInt(betAmount, 10)
          });
        } else if (played) {
          this.setState({
            canRegister: false,
            canPlay: false,
            canReveal: currentGameState._playStarted
              ? false
              : currentGameState._revealing
                ? true
                : false,
            canClaimReward: false,
            preInputText:
              currentGameState._playStarted || currentGameState._revealing
                ? stateChange["preInputText"]
                : "Wait for next game to bet.",
            inputPlaceholder:
              currentGameState._playStarted || currentGameState._revealing
                ? stateChange["inputPlaceholder"]
                : "Not accepting any bets",
            postInputText: "",
            gameState:
              "Wait for Reveal mode to start for Game " +
              this.state.currentGame +
              " to confirm your choice again." +
              " You had bet " +
              parseInt(betAmount, 10)
          });
        } else if (registered) {
          this.setState({
            canRegister: false,
            canPlay: currentGameState._registerationOpen
              ? false
              : !currentGameState._playStarted
                ? false
                : true,
            canReveal: false,
            canClaimReward: false,
            preInputText:
              currentGameState._registerationOpen ||
              currentGameState._playStarted
                ? stateChange["preInputText"]
                : "Wait for next game to bet.",
            inputPlaceholder:
              currentGameState._registerationOpen ||
              currentGameState._playStarted
                ? stateChange["inputPlaceholder"]
                : "Not accepting any bets",
            postInputText: "",
            gameState: currentGameState._registerationOpen
              ? opponentBetAmount !== "0"
                ? "Wait for Submit Encrypted Choice to start for Game " +
                  this.state.currentGame +
                  " You had bet " +
                  parseInt(betAmount, 10) +
                  " You have been paired with " +
                  opponent
                : "Wait for Submit Encrypted Choice to start for Game " +
                  this.state.currentGame +
                  " You had bet " +
                  parseInt(betAmount, 10)
              : currentGameState._playStarted
                ? opponentBetAmount !== "0"
                  ? stateChange["gameState"] +
                    " You have been paired with " +
                    opponent
                  : "Wait for game to pair you up with some one !" +
                    " You had bet " +
                    parseInt(betAmount, 10)
                : stateChange["gameState"]
          });
        } else {
          let registerationOpen = currentGameState._registerationOpen;
          let playStarted = currentGameState._playStarted;
          let revealing = currentGameState._revealing;
          let lastGameFinished = currentGameState._lastGameFinished;
          let gameNumber = parseInt(currentGameState._gameNumber, 10);
          let totalPlayers = currentGameState._totalPlayers;
          if (registerationOpen) {
            this.setState({
              canRegister: true,
              preInputText: "Place your bet here.",
              inputPlaceholder: "Enter amount to bet.",
              postInputText: "(in ether)",
              gameState: "Place your Bets for Game Number " + gameNumber,
              canClaimReward: false //TODO : For now claim reward only just after the game finsihes and befor enext game starts
            });
            if (totalPlayers > 0) {
              this.setState({
                gameState:
                  "Place you Bets for Game Number " +
                  gameNumber +
                  ". A total of " +
                  totalPlayers +
                  " have registered."
              });
            }
          } else if (playStarted) {
            this.setState({
              canPlay: true,
              preInputText: "Enter your choice. (Steal[EVEN], Split[ODD])",
              inputPlaceholder: "Enter Choice",
              postInputText: "",
              gameState: "Enter your choice for Game Number " + gameNumber
            });
          } else if (revealing) {
            this.setState({
              canReveal: true,
              preInputText:
                "Enter your previously selected choice.(Split[ODD] or Steal[EVEN]) for Game " +
                this.state.currentGame,
              inputPlaceholder: "Enter Same Choice Again",
              postInputText: "",
              gameState:
                "Verify your choice for Game Number " +
                gameNumber +
                " (Even for STEAL, Odd for SPLIT)"
            });
          } else if (lastGameFinished) {
            this.setState({
              canClaimReward: gameNumber === 0 ? false : true,
              preInputText: "Wait for next game to bet",
              postInputText: "",
              gameState:
                "No game is live currently. Last Game Number " + gameNumber
            });
            if (gameNumber === 0) {
              this.setState({
                gameState: "No games have been played yet. Be Ready !"
              });
            }
          }
        }

        let registerationOpen = currentGameState._registerationOpen;
        let playStarted = currentGameState._playStarted;
        let revealing = currentGameState._revealing;
        let lastGameFinished = currentGameState._lastGameFinished;
        let gameNumber = parseInt(currentGameState._gameNumber, 10);
        let totalPlayers = currentGameState._totalPlayers;

        if (lastGameFinished) {
          this.setState({
            canClaimReward:
              gameNumber === 0 ? false : claimedReward ? false : true,
            preInputText: "Wait for next game to bet",
            postInputText: "",
            gameState:
              "No game is live currently. Last Game Number " + gameNumber
          });
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
        let stateChange = {};
        let currentGameState = result;
        let registerationOpen = result._registerationOpen;
        let playStarted = result._playStarted;
        let revealing = result._revealing;
        let lastGameFinished = result._lastGameFinished;
        let gameNumber = parseInt(result._gameNumber, 10);
        let totalPlayers = result._totalPlayers;
        //TODO add total player to state and use in UI

        this.setState({
          currentGame: gameNumber
        });

        if (registerationOpen) {
          stateChange = {
            canRegister: true,
            preInputText: "Place your bet here.",
            inputPlaceholder: "Enter amount to bet.",
            postInputText: "(in ether)",
            gameState: "Place your Bets for Game Number " + gameNumber,
            canClaimReward: false //TODO : For now claim reward only just after the game finsihes and befor enext game starts
          };
          if (totalPlayers > 0) {
            stateChange["gameState"] =
              "Place you Bets for Game Number " +
              gameNumber +
              ". A total of " +
              totalPlayers +
              " have registered.";
          }
        } else if (playStarted) {
          stateChange = {
            canPlay: true,
            preInputText: "Enter your choice. (Steal[EVEN], Split[ODD])",
            inputPlaceholder: "Enter Choice",
            postInputText: "",
            gameState: "Enter your choice for Game Number " + gameNumber
          };
        } else if (revealing) {
          stateChange = {
            canReveal: true,
            preInputText:
              "Enter your previously selected choice.(Split[ODD] or Steal[EVEN]) for Game " +
              this.state.currentGame,
            inputPlaceholder: "Enter Same Choice Again",
            postInputText: "",
            gameState:
              "Verify your choice for Game Number " +
              gameNumber +
              " (Even for STEAL, Odd for SPLIT)"
          };
        } else if (lastGameFinished) {
          stateChange = {
            canClaimReward: gameNumber === 0 ? false : true,
            preInputText: "Wait for next game to bet",
            postInputText: "",
            gameState:
              "No game is live currently. Last Game Number " + gameNumber
          };
          if (gameNumber === 0) {
            stateChange["gameState"] =
              "No games have been played yet. Be Ready !";
          }
        }

        this.setPlayerState(stateChange, currentGameState);
      });
  };

  registerStateListener = () => {
    setInterval(() => {
      this.setGameState();
    }, 2000);
  };

  //User interaction Methods
  startRegistration = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.startRegistration();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for start registration has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  bet = () => {
    let transactionGas;
    console.log(new Web3(window.web3.currentProvider).extend);
    let betInWei = new Web3(window.web3.currentProvider).extend.utils.toWei(
      new Web3(window.web3.currentProvider).extend.utils.toBN(
        parseInt(this.state.inputValue, 10)
      ),
      "ether"
    );
    console.log(" Bet amount in Wei " + betInWei);
    let transaction = this.state.contract.methods.bet(betInWei);
    //TODO : Check Why estimateGas  not working here
    // console.log(transaction);
    // transaction.estimateGas().then(gasAmount => {
    //   console.log("gas Estimate " + gasAmount);
    //   transactionGas = 300000;
    transaction
      .send({
        from: this.state.metamaskAccount,
        gas: transactionGas * 2,
        value: betInWei
      })
      .on("transactionHash", function(hash) {
        console.log("You Bet has been submitted " + hash);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        //Upto 24 confirmations
        console.log("You bet has got " + confirmationNumber + " confirmations");
        console.log(receipt);
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // });
  };

  stopRegistration = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.stopRegisteration();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for stop registration has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  startPlay = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.startPlay();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for start play has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  submit = () => {
    let transactionGas;
    var choice = parseInt(this.state.inputValue, 10);
    //That's how you calculate keccak256 from DApp and send to Smart contract
    let encryptedChoice = new Web3(
      window.web3.currentProvider
    ).utils.soliditySha3(choice);

    let transaction = this.state.contract.methods.submit(encryptedChoice);
    //TODO : Check Why estimateGas  not working here
    // transaction.estimateGas().then(gasAmount => {
    //   console.log("gas Estimate " + gasAmount);
    //   transactionGas = 300000;
    transaction
      .send({
        from: this.state.metamaskAccount,
        gas: transactionGas * 2
      })
      .on("transactionHash", function(hash) {
        console.log("You choice has been submitted " + hash);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        //Upto 24 confirmations
        console.log(
          "You choice has got " + confirmationNumber + " confirmations"
        );
        console.log(receipt);
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // });
  };

  stopPlay = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.stopPlay();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for stop play has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  startReveal = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.startReveal();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for start reveal has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  reveal = () => {
    let transactionGas;
    var choice = parseInt(this.state.inputValue, 10);

    let transaction = this.state.contract.methods.reveal(choice);
    //TODO : Check Why estimateGas  not working here
    // transaction.estimateGas().then(gasAmount => {
    //   console.log("gas Estimate " + gasAmount);
    //   transactionGas = 300000;
    transaction
      .send({
        from: this.state.metamaskAccount,
        gas: transactionGas * 2
      })
      .on("transactionHash", function(hash) {
        console.log("You revealed choice has been submitted " + hash);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        //Upto 24 confirmations
        console.log(
          "You revealed choice has got " + confirmationNumber + " confirmations"
        );
        console.log(receipt);
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // });
  };

  stopReveal = () => {
    let transactionGas;
    let transaction = this.state.contract.methods.stopReveal();
    // transaction
    //   .estimateGas()
    //   .then(gasAmount => {
    //     console.log("Gas Estimate " + gasAmount);
    //     transactionGas = gasAmount;
    transaction
      .send({ from: this.state.metamaskAccount, gas: transactionGas * 2 })
      .on("transactionHash", function(hash) {
        console.log("Your request for stop play has been submitted");
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log(
          "You request has got " + confirmationNumber + " confirmations"
        );
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });
  };

  claimReward = () => {
    let transactionGas;

    let transaction = this.state.contract.methods.claimReward(
      this.state.currentGame
    );
    //TODO : Check Why estimateGas  not working here
    // transaction.estimateGas().then(gasAmount => {
    //   console.log("gas Estimate " + gasAmount);
    //   transactionGas = 300000;
    transaction
      .send({
        from: this.state.metamaskAccount,
        gas: transactionGas * 2
      })
      .on("transactionHash", function(hash) {
        console.log("Your claim reward request has been submitted " + hash);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        //Upto 24 confirmations
        console.log(
          "You claim reward request has got " +
            confirmationNumber +
            " confirmations"
        );
        console.log(receipt);
        let event = receipt.events.RegisterationOpened;
        if (confirmationNumber === 20) {
          this.setState({
            gameState:
              "Game Number " + event.returnValues._gameNumber + " has started",

            canClaimReward: false //TODO : For now claim reward only just after the game finsihes and befor enext game starts
          });
        }
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      });
    // });
  };

  updateInputValue = event => {
    const val = event.target.value;
    console.log(val);
    this.setState({
      inputValue: parseInt(val, 10)
    });
  };

  AdminSection = (metamaskAccount, contractOwner) => {
    if (metamaskAccount === contractOwner) {
      return (
        <div className="Admin">
          <div style={{ paddingBottom: "10px" }}>
            <b>Game Admin Functions</b>
          </div>
          <div>
            {"         "}
            <button className="button-admin" onClick={this.startRegistration}>
              Start Registration
            </button>
            {"         "}
            <button className="button-admin" onClick={this.stopRegistration}>
              Stop Registration
            </button>
            {"         "}
            <button className="button-admin" onClick={this.startPlay}>
              Start Play
            </button>
            {"         "}
            <button className="button-admin" onClick={this.stopPlay}>
              Stop Play
            </button>
            {"         "}
            <button className="button-admin" onClick={this.startReveal}>
              Start Reveal
            </button>
            {"         "}
            <button className="button-admin" onClick={this.stopReveal}>
              Stop Reveal
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
          <b>Player Functions</b>
        </div>
        <div>
          {"         "}
          <button className={btnPlayerBetClassNames} onClick={this.bet}>
            Bet
          </button>
          {"         "}
          <button className={btnPlayerPlayClassNames} onClick={this.submit}>
            Submit Encrypted Choice
          </button>
          {"         "}
          <button className={btnPlayerRevealClassNames} onClick={this.reveal}>
            Reveal Actual Choice
          </button>
          {"         "}
          <button
            className={btnPlayerClaimClassNames}
            onClick={this.claimReward}
          >
            Claim Reward
          </button>
        </div>
      </div>
    );
  };

  GameSection = (metamaskInstalled, noAccountsInMetamask) => {
    if (metamaskInstalled && !noAccountsInMetamask) {
      return (
        <div>
          {this.AdminSection(
            this.state.metamaskAccount,
            this.state.contractOwner
          )}
          {this.PlayerSection()}
          <div className="GameState">
            {/* TODO : how to make game state bold/italic */}
            <b>{this.state.gameState}</b>
          </div>
          <div className="PlayerInput">
            Your address{" "}
            <b>
              <font color="blue">{this.state.metamaskAccount}</font>
            </b>
            <div className="bottomMargin">{this.state.preInputText}</div>
            <div className="bottomMargin">
              <AutosizeInput
                placeholder={this.state.inputPlaceholder}
                placeholderIsMinWidth
                autoComplete="off"
                inputClassName="input"
                onChange={this.updateInputValue}
                value={this.state.inputValue}
                min="1"
              />
            </div>
            <div className="bottomMargin">{this.state.postInputText}</div>
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
        {this.GameSection(
          this.state.metamaskInstalled,
          this.state.noAccountsInMetamask
        )}
      </div>
    );
  };
}
