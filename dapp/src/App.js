import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import abi from './ContractABI.json';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      contract: null,
      gameState: "NotPlaying",
      choice: -1,
      betAmount: 0 //in Ether
    };
    var ETHERIUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    this.contract = new ETHERIUM_CLIENT.eth.Contract(abi["abi"], "0x345ca3e014aaf5dca488057592ee47305d9b3e10");

    this.startRegistration = this.startRegistration.bind(this);
    this.bet = this.bet.bind(this);
    this.stopRegistration = this.stopRegistration.bind(this);
  }

  componentWillMount() {
    //TODO
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to "SPLIT or STEAL" game on BLOCKCHAIN</h1>
        </header>
          <div class="Centre">
            <div class="Admin">
              <div style={{paddingBottom: "10px"}}>   
                <b>Game Admin Functions</b>
              </div>
              <div >
                {'         '}
                <button class="button-admin" label="Start Bet" onClick={this.startRegistration}>Start Registration</button>
                {'         '}
                <button class="button-admin" label="Stop Bet" onClick={this.stopRegistration}>Stop Registration</button>
                {'         '}
                <button class="button-admin" label="Start Play" onClick={this.startPlay}>Start Play</button>
                {'         '}
                <button class="button-admin" label="Stop Play" onClick={this.stopPlay}>Stop Play</button>
                {'         '}
                <button class="button-admin" label="Start Reveal" onClick={this.startReveal}>Start Reveal</button>
                {'         '}
                <button class="button-admin" label="Stop Reveal" onClick={this.stopReveal}>Stop Reveal</button>
              </div>
            </div>
            <div class="Player">      
              <div style={{paddingBottom: "10px"}}>   
                <b>Player Functions</b>
              </div>
              <div>
                {'         '}
                <button class="button-player" label="Bet" onClick={this.bet}>Bet</button>
                {'         '}
                <button class="button-player" label="Submit Encrypted Choice" onClick={this.submit}>Submit Encrypted Choice</button>
                {'         '}
                <button class="button-player" label="Reveal Actual Choice" onClick={this.reveal}>Reveal Actual Choice</button>
                {'         '}
                <button class="button-player" label="Claim Reward" onClick={this.claimReward}>Claim Reward</button>
              </div>
            </div>
          </div>
        
      </div>
    );
  }

  startRegistration() { 

  }
  bet() {

  }
  stopRegistration() {

  }
  startPlay() {

  }
  submit() {

  }
  stopPlay() {

  }
  startReveal() {

  }
  reveal() {

  }
  stopReveal() {

  }
  claimReward() {

  }
}

export default App;
