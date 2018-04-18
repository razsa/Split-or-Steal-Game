const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);


SplitStealContract.deployed().then(function(instance) {
    
    return instance.getContractBalance.call();
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result); 
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  