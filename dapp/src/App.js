import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";

//TODO : ETHEREUM_CLIENT usage , can be scoped to file instead of App
//TODO : NO SHOW WHO You are paired other wise people can exploit it
//TODO : CssTransitionGroup Animation
class MyHeader extends Component {
  render() {
    let {
      metamaskInstalled,
      noAccountsInMetamask,
      contractBalance,
      warning
    } = this.props;
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

        <div class="App-info">
          <div style={{ paddingTop: "0px" }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.fkinternal.com/Flipkart/Split-or-Steal-Game/blob/master/README.md"
            >
              <b>How to play this game ?</b>
            </a>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <b>Contract Balance is {contractBalance}</b>
            {"                      "}
            <b>{warning}</b>
          </div>
        </div>
      </header>
    );
  }
}

export default class App extends Component {
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
      gameState: "Fetching the latest game state... Please wait",
      registerationOpen: false,
      playStarted: false,
      revealing: false,
      lastGameFinished: false,
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
      this.setState({
        contract: new client.eth.Contract(
          abi["abi"],
          "0xcf21469f3a96751452c94ab30dfad9b879b58259"
        ),
        contractAddress: "0xcf21469f3a96751452c94ab30dfad9b879b58259"
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
          console.log("Metaask Account Changed");
        }
      });
    }, 2000);
  };

  setPlayerState = currentGameState => {
    if (currentGameState._gameNumber <= 0) {
      this.setState({
        gameState: "No Games have been played yet."
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
        // let opponent = result._opponent;

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
          console.log("CLAIMED REWARD");
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
              " and you won " +
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
                ? "Enter your previously selected choice.(Split[ODD] or Steal[EVEN]) for Game " +
                  this.state.currentGame
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
                ? "Reveal your choice for Game Number " + gameNumber
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
                ? "Enter your choice.(Split[ODD] or Steal[EVEN]) for Game " +
                  this.state.currentGame
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
                ? "Enter your choice(Split[ODD] or Steal[EVEN]) for Game" +
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
                "Place you Bets for Game Number " +
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
        console.log("GAME STATE RESULT");
        console.log(result);

        //Set curent Game Number
        let gameNumber = parseInt(result._gameNumber, 10);
        this.setState({
          currentGame: gameNumber
        });

        console.log("Setting Game State .....");
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
    console.log(
      new Web3(window.web3.currentProvider).utils.toBN(
        parseFloat(this.state.inputValue) * 1e18
      )
    );
    let betInWei = new Web3(window.web3.currentProvider).utils.toWei(
      new Web3(window.web3.currentProvider).utils.toBN(
        parseFloat(this.state.inputValue) * 1e18
      ),
      "wei"
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

  fundContract = () => {
    let fundInWei = new Web3(window.web3.currentProvider).utils.toWei(
      new Web3(window.web3.currentProvider).utils.toBN(
        parseFloat(this.state.inputValue) * 1e18
      ),
      "wei"
    );
    let transaction = this.state.contract.methods.fund();
    console.log(fundInWei);
    transaction
      .send({
        from: this.state.metamaskAccount,
        value: fundInWei
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

    let transaction = this.state.contract.methods.claimRewardK(
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
        // let event = receipt.events.RegisterationOpened;
      })
      .on("receipt", function(receipt) {
        console.log(receipt);
      })
      .on("error", () => {
        this.setState({
          warning: "Contract has insufficient balance. Try again later"
        });
      });
    // });
  };

  updateInputValue = event => {
    const val = event.target.value;

    console.log(val);
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
            <b>Game Admin Functions</b>
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
          contractBalance={this.state.contractBalance}
          warning={this.state.warning}
        />
        {this.GameSection(
          this.state.metamaskInstalled,
          this.state.noAccountsInMetamask
        )}
      </div>
    );
  };
}
