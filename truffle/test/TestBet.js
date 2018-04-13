const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);
SplitStealContract.deployed().then(function(instance) {
    //TODO : MODIFY THE FOLLOWING ADDRESS ACCORDING TO YOUR SETUP
    
    const filter = web3.eth.filter({
      fromBlock: 0,
      toBlock: 'latest',
      address: '0x345ca3e014aaf5dca488057592ee47305d9b3e10',
      topics: [web3.sha3('Played(msg.sender, _choice, _betAmount)')]
    })
    
    filter.watch((error, result) => {
        console.log(result);
       if(error) {
          console.log("Failed watching event")
       } else {
          console.log("Got event callback")
          console.log(result);
       }
    })
    return instance.bet(1, web3.toWei(1, "ether"), {from: web3.eth.accounts[4], gas: 3000000, value: web3.toWei(1, "ether")});
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  