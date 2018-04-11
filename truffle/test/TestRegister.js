const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);

SplitStealContract.deployed().then(function(instance) {
    //TODO : MODIFY THE FOLLOWING ADDRESS ACCORDING TO YOUR SETUP
    var sender = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
    //TODO : Not Working
    return instance.register({from: sender, value: web3.toWei(0.05, "ether")});
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  