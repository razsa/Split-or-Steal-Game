const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);


SplitStealContract.deployed().then(function(instance) {
    //TODO : MODIFY THE FOLLOWING ADDRESS ACCORDING TO YOUR SETUP
    var owner = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
    return instance.stopRegisteration({from: owner});
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  