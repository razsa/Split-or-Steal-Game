const artifacts = require('../build/contracts/SplitStealContract.json')
const contract = require('truffle-contract')
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);


SplitStealContract.deployed().then(function(instance) {

    const filter1 = instance.Log({
        fromBlock: 0, 
        toBlock: 'latest'
    });
    filter1.watch((error, result) => {
      if(error) {
          console.log("Failed watching event")
      } else {
          console.log("event callback starts")
          console.log(result.args);
          console.log("event callback ends")
      }
    });

    const filter2 = instance.LogInt({
      fromBlock: 0, 
      toBlock: 'latest'
    });
    filter2.watch((error, result) => {
      if(error) {
          console.log("Failed watching event")
      } else {
          console.log("event callback starts")
          console.log(result.args);
          console.log("event callback ends")
      }
    });

    const filter = instance.GameFished({
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

    //TODO : MODIFY THE FOLLOWING ADDRESS ACCORDING TO YOUR SETUP
    var owner = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
    //TODO : Getting error possible because of error in smart contract code.
    return instance.reveal({from: owner, gas: 1000000000});//Give good amount of gas
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result); 
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  