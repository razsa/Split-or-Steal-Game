const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);
SplitStealContract.deployed().then(function(instance) {
    const filter = instance.Played({
        fromBlock: 0, 
        toBlock: 'latest'
    });
    filter.watch((error, result) => {
       if(error) {
          console.log("Failed watching event")
       } else {
          console.log("event callback starts")
          console.log(result.args);
          console.log("event callback ends")
       }
    });
    return instance.bet(1, web3.toWei(1, "ether"), {from: web3.eth.accounts[5], gas: 3000000, value: web3.toWei(1, "ether")});
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  