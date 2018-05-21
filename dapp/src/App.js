import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import abi from "./ContractABI.json";
import AutosizeInput from "react-input-autosize";
import About from "./components/About.js";
import Fair from "./components/Fair.js";
import MyHeader from "./components/Header.js";
import Loading from "./components/Loading.js";
import RewardMatrix from "./components/RewardMatrix.js";
import Player from "./components/Player.js";
import Donate from "./components/Donate.js";
import Footer from "./components/Footer.js";

//TODO : CssTransitionGroup Animation
//TODO : Add Animation for EVEN STEAL and odd SPLIT

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Global State
      intervals: [],
      lastStateOk: false,
      netId: null,
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
      overrideGameNumber: "",
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
    this.init();
  };

  init = () => {
    setInterval(() => {
      if (typeof window.web3 !== "undefined") {
        let web3 = new Web3(window.web3.currentProvider);
        this.setState({
          web3: web3
        });
        this.setState({
          contract: new web3.eth.Contract(
            abi,
            "0xbf601702214a7071684d17981ad6d0a65366499b"
          ),
          contractAddress: "0xbf601702214a7071684d17981ad6d0a65366499b"
        });
        //Check if metamask is installed/enabled
        if (web3.currentProvider.isMetaMask) {
          this.setState({
            metamaskInstalled: true
          });
          window.web3.version.getNetwork((err, netId) => {
            this.setState({ netId: netId });
          });
          web3.eth.getAccounts((error, accounts) => {
            if (accounts.length === 0) {
              this.state.intervals.forEach(clearInterval);
              this.setState({
                noAccountsInMetamask: true,
                lastStateOk: false,
                intervals: []
              });

              console.error("No Accounts in Metamask");
            } else {
              this.setState({
                noAccountsInMetamask: false,
                metamaskAccount: accounts[0]
              });
              if (!this.state.lastStateOk) {
                this.setContractOwner();
              }
              this.setState({
                lastStateOk: true
              });
            }
          });
        } else {
          this.state.intervals.forEach(clearInterval);
          this.setState({
            metamaskInstalled: false,
            lastStateOk: false,
            intervals: []
          });
          // Another web3 provider
          console.error("Some unknown web 3 provider found.");
        }
      } else {
        this.state.intervals.forEach(clearInterval);
        this.setState({
          metamaskInstalled: false,
          lastStateOk: false,
          intervals: []
        });
        // No web 3 provider
        console.error("No web 3 provider found.");
      }
    }, 2000);
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
        console.log("Contract Owner is " + result);
        this.registerMetamaskAddressChangeListner();
        this.registerStateListener();
        this.registerPlayerStateListner();
      });
  };

  registerMetamaskAddressChangeListner = () => {
    let interval = setInterval(() => {
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
            metamaskAccount: accounts[0]
          });
          console.log("Metamask Account Changed");
        }
      });
    }, 2000);
    let _intervals = this.state.intervals;
    _intervals.push(interval);
    this.setState({
      intervals: _intervals
    });
  };

  registerStateListener = () => {
    let interval = setInterval(() => {
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
    let _intervals = this.state.intervals;
    _intervals.push(interval);
    this.setState({
      intervals: _intervals
    });
  };

  registerPlayerStateListner = () => {
    let interval = setInterval(() => {
      this.updateTotalGamesStarted();
      this.updateTotalGamesJoined();
      this.updateFetchedGames();
      this.updateTotalGames();
    }, 2000);
    let _intervals = this.state.intervals;
    _intervals.push(interval);
    this.setState({
      intervals: _intervals
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

  updateFetchedGames = () => {
    let _allGames = this.state.allGames;
    for (let gameNumber in _allGames) {
      try {
        this.updateGame(gameNumber, false);
      } catch (ignore) {}
    }
  };

  updateGame = (gameNumber, tellUser) => {
    // console.log("Updating Game " + gameNumber);
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
    let stageTimeout = 0;

    this.state.contract.methods
      .getGameState(gameNumber)
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(resultGameState => {
        // console.log("Updating game " + gameNumber);
        registerationOpen = resultGameState._registerationOpen;
        revealing = resultGameState._revealing;
        lastGameFinished = resultGameState._lastGameFinished;
        startTime = resultGameState._startTime;
        revealTime = resultGameState._revealTime;
        finishTime = resultGameState._finishTime;
        stageTimeout = resultGameState._stageTimeout;

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
              stageTimeout: stageTimeout,
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
            this.setState({
              allGames: _allGames,
              allGameLocalOverride: _allGameLocalOverride,
              allGameMessage: _allGameMessage
            });
          });
      });
  };

  updateTotalGames = () => {
    this.state.contract.methods
      .getTotalGames()
      .call({
        from: this.state.metamaskAccount,
        gas: Math.min(Math.floor(Math.random() * 10000000) + 1, 210000)
      })
      .then(_result => {
        let result = parseInt(_result, 10);
        let oldTotalGames = this.state.totalGames;
        // console.log("Total Games from Contract " + result);
        let _totalGamesMessage = this.state.totalGamesMessage;
        if (result === 0) {
          _totalGamesMessage = "No Games have been played yet.";
        }
        if (this.state.totalGames < result) {
          let newGames = result - oldTotalGames;
          // console.log("Found " + newGames + " Game(s), Fetching....");
          _totalGamesMessage = "Found " + newGames + " Game(s), Fetching....";
          this.setState({
            totalGames: parseInt(result, 10),
            totalGamesMessage: _totalGamesMessage
          });
        } else {
          this.setState({
            totalGames: parseInt(result, 10),
            totalGamesMessage: _totalGamesMessage
          });
        }
        let _totalGames = this.state.totalGames;
        let _allGames = this.state.allGames;
        if (_totalGames !== 0 && _totalGames === this.state.totalGamesFetched) {
          this.setState({
            totalGamesMessage: "All Games have been fetched."
          });
          return;
        }
        for (let gameNumber = _totalGames; gameNumber > 0; gameNumber--) {
          if (_allGames[gameNumber] !== undefined) {
            continue;
          }
          this.addToAllGames(gameNumber);
        }
      });
  };

  addToAllGames = gameNumber => {
    // console.log("Fetching game number " + gameNumber);
    // this.setState({
    //   totalGamesMessage: "Fetching game number " + gameNumber.toString()
    // });
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
    let stageTimeout = 0;

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
        stageTimeout = resultGameState._stageTimeout;
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
            let _allGames = this.state.allGames;
            let _totalGamesFetched = this.state.totalGamesFetched;
            _allGames[gameNumber] = {
              gameNumber: gameNumber,
              registerationOpen: registerationOpen,
              revealing: revealing,
              lastGameFinished: lastGameFinished,
              startTime: startTime,
              revealTime: revealTime,
              finishTime: finishTime,
              stageTimeout: stageTimeout,
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
            let _totalGamesMessage = this.state.totalGamesMessage;
            if (gameNumber === 1) {
              //   if (_totalGamesFetched % this.state.maxAutoFetchGames === 0) {
              //     _totalGamesMessage =
              //       "Click on 'Get More Games' to fetch previous games.";
              //   } else {
              //     _totalGamesMessage = "Fetching game number " + (gameNumber - 1);
              //   }
              // } else {
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
        // console.log(
        //   "You request has got " + confirmationNumber + " confirmations"
        // );
      })
      .on("receipt", receipt => {
        // console.log(receipt);
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
          // console.log(
          //   "Your request for withdraw earnings has been submitted. "
          // );
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
          this.setState({
            adminStateOverride: false,
            adminStateMessage: ""
          });
        });
    };
  }

  override(gameNumber) {
    return () => {
      let transaction = this.state.contract.methods.ownerOverride(
        parseInt(gameNumber, 10)
      );
      transaction
        .send({
          from: this.state.metamaskAccount
        })
        .on("transactionHash", hash => {
          this.setState({
            adminStateOverride: true,
            adminStateMessage: "Overriding Game....."
          });
          // console.log("Your request for overriding has been submitted. ");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
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
          // console.log(
          //   "Your request for start registration has been submitted. "
          // );
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
          this.setState({
            startGameLocalOverride: false,
            startGameMessage: ""
          });
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
          // console.log("Your request for bet has been submitted.");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
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
          // console.log("Your request for revealing choice has been submitted.");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
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

          // console.log("Your request has been submitted");
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // console.log(
          //   "You request has got " + confirmationNumber + " confirmations"
          // );
        })
        .on("receipt", receipt => {
          // console.log(receipt);
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

  updateOverrideGameNumber = event => {
    const val = event.target.value;
    this.setState({
      overrideGameNumber: val
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

      let overrideGameNumber = 0;
      let canOverrideGame = false;
      try {
        overrideGameNumber = parseInt(this.state.overrideGameNumber, 10);
      } catch (ignore) {}
      let nowSecs = new Date().getTime() / 1000;
      if (
        this.state.totalGames >= overrideGameNumber &&
        overrideGameNumber > 0
      ) {
        let game = this.state.allGames[overrideGameNumber];
        if (game.registerationOpen) {
          if (
            nowSecs - parseInt(game.startTime, 10) >
            parseInt(game.stageTimeout, 10)
          ) {
            canOverrideGame = true;
          }
        } else if (game.revealing) {
          if (
            nowSecs - parseInt(game.revealTime, 10) >
            parseInt(game.stageTimeout, 10)
          ) {
            canOverrideGame = true;
          }
        } else if (game.lastGameFinished) {
          if (
            nowSecs - parseInt(game.finishTime, 10) >
            parseInt(game.stageTimeout, 10)
          ) {
            canOverrideGame = true;
          }
        }
      }

      let disableOverride =
        this.state.adminStateOverride ||
        this.state.overrideGameNumber === "" ||
        !canOverrideGame;
      let className = disbaled ? "button-admin" : "button-admin-enabled";
      let classNameOverride = disableOverride
        ? "button-admin"
        : "button-admin-enabled";
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
            <br />
            <div>
              <div>
                <AutosizeInput
                  placeholder="Game number to override."
                  inputClassName="game-input"
                  onChange={this.updateOverrideGameNumber}
                  value={this.state.overrideGameNumber}
                />
              </div>
              <button
                className={classNameOverride}
                onClick={this.override()}
                disabled={disableOverride}
              >
                Override Game
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

  NewGame = () => {
    let disable =
      isNaN(this.state.startGameBetAmount) ||
      isNaN(this.state.startGameChoice) ||
      !Number.isInteger(parseFloat(this.state.startGameChoice)) ||
      this.state.startGameBetAmount === "" ||
      this.state.startGameChoice === "" ||
      this.state.startGameLocalOverride;
    let className = disable ? "button-player" : "button-new-games";
    return (
      <div className="NewGame" id="new-game">
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
            disabled={disable}
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
    let _allGames = this.state.allGames;
    let gameNumberList = [];
    for (let gameNumber in _allGames) {
      gameNumberList.push(gameNumber);
    }
    gameNumberList.sort();
    gameNumberList.reverse();
    // console.log(this.state.allGames);
    // console.log(this.state.totalGamesFetched);
    for (let i = 0; i < gameNumberList.length; i++) {
      let _gameNumber = gameNumberList[i];
      let gameNumber = parseInt(_gameNumber, 10);
      let game = this.state.allGames[gameNumber];
      if (game === undefined) {
        // console.log("GAME is undefined ! for game number " + gameNumber);
        continue;
      }
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
      let timeout = "";
      let disabled = this.state.allGameLocalOverride[gameNumber];
      let classNameGame = disabled ? "button-player" : "button-player-enabled";
      if (game.registerationOpen) {
        sinceStart =
          "Game Started on " +
          new Date(parseInt(game.startTime, 10) * 1000).toString();
        timeout =
          "Game will expire on " +
          new Date(
            (parseInt(game.startTime, 10) + parseInt(game.stageTimeout, 10)) *
              1000
          ).toString();
        if (game.registered) {
          gameState = "Waiting for someone to join the game.";
          cta = (
            <div>
              <button
                className={classNameGame}
                onClick={this.claimReward(gameNumber)}
                disabled={disabled}
              >
                Abandon Game
              </button>
              <div>
                <br />
                <a href="#abandon-game">[Abandon?]</a>
              </div>
            </div>
          );
        } else {
          gameState = "Place your Bet.";
          disabled =
            disabled ||
            isNaN(this.state.allGameBetAmount[gameNumber]) ||
            isNaN(this.state.allGameChoice[gameNumber]) ||
            !Number.isInteger(
              parseFloat(this.state.allGameChoice[gameNumber])
            ) ||
            this.state.allGameBetAmount[gameNumber] === "" ||
            this.state.allGameChoice[gameNumber] === "";
          classNameGame = disabled ? "button-player" : "button-player-enabled";
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
              {"ODD number for SPLIT / EVEN number for STEAL"}
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
        timeout =
          "Game will expire on " +
          new Date(
            (parseInt(game.revealTime, 10) + parseInt(game.stageTimeout, 10)) *
              1000
          ).toString();
        if (!game.registered) {
          gameState = "You cannot play this game. This is";
          gameSubstate = "being played by some other people.";
        } else if (game.revealed) {
          if (game.disqualified) {
            timeout = null;
            gameState = "Your are disqualified.";
          } else {
            gameState = "Waiting for opponent to reveal choice.";
          }
        } else {
          gameState = "Reveal your previously entered choice.";
          gameSubstate = "ODD number for SPLIT / EVEN number for STEAL";
          disabled =
            disabled ||
            isNaN(this.state.allGameRevealChoice[gameNumber]) ||
            !Number.isInteger(
              parseFloat(this.state.allGameRevealChoice[gameNumber])
            ) ||
            this.state.allGameRevealChoice[gameNumber] === "";
          classNameGame = disabled ? "button-player" : "button-player-enabled";
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
        timeout =
          "Game will expire on " +
          new Date(
            (parseInt(game.finishTime, 10) + parseInt(game.stageTimeout, 10)) *
              1000
          ).toString();
        gameState = "This game is finished.";
        if (!game.registered) {
          gameSubstate = "You did not play this game.";
        } else if (game.disqualified) {
          timeout = null;
          gameState = "Your got disqualified.";
        } else if (game.claimedReward) {
          timeout = null;
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
        <div key={gameNumber} className="AllGamesCard">
          <div>
            <h3>
              <b>GAME NUMBER {game.gameNumber}</b>
            </h3>
            <div>{sinceStart}</div>
            <div>{sinceReveal}</div>
            <div>{sinceFinished}</div>
            <br />
            <div>
              <a href="#stage-timeout">{timeout}</a>{" "}
            </div>
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
        <div className="AllGames" id="all-games">
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

  GameSection = () => {
    if (
      this.state.metamaskInstalled &&
      !this.state.noAccountsInMetamask &&
      this.state.netId === "4"
    ) {
      return (
        <div>
          <div className="Game-section">
            <Player metamaskAccount={this.state.metamaskAccount} />
            {this.AdminSection(
              this.state.metamaskAccount,
              this.state.contractOwner
            )}
            <RewardMatrix
              contractBalance={this.state.contractBalance}
              k={this.state.k}
              gameFees={this.state.gameFees}
              minBet={this.state.minBet}
              maxBet={this.state.maxBet}
              stageTimeout={this.state.stageTimout}
            />
            {this.NewGame()}
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
    let changeNetwork = true;
    if (this.state.netId === "4") {
      changeNetwork = false;
    }
    return (
      <div className="App">
        <MyHeader
          metamaskInstalled={this.state.metamaskInstalled}
          noAccountsInMetamask={this.state.noAccountsInMetamask}
          changeNetwork={changeNetwork}
          netId={this.state.netId}
        />
        {this.GameSection()}
        <About
          k={this.state.k}
          metamaskInstalled={this.state.metamaskInstalled}
          noAccountsInMetamask={this.state.noAccountsInMetamask}
          changeNetwork={changeNetwork}
        />
        <Fair />
        <Donate
          metamaskInstalled={this.state.metamaskInstalled}
          noAccountsInMetamask={this.state.noAccountsInMetamask}
          changeNetwork={changeNetwork}
          updateFundValue={this.updateFundValue}
          fundValue={this.state.fundValue}
          fundContract={this.fundContract}
        />
        <Footer />
      </div>
    );
  };
}

export default App;
