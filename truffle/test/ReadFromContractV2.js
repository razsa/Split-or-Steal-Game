0x460e2134173aa1ed87866ee72221d8d0082a1609;

const artifacts = require("../build/contracts/SplitStealContractV2.json");
const contract = require("truffle-contract");
const SplitStealContractV2 = contract(artifacts);
SplitStealContractV2.setProvider(web3.currentProvider);

SplitStealContractV2.deployed()
  .then(function(instance) {
    return instance.getLastFiveGames(3);
  })
  .then(function(result) {
    console.log("*******************************************************");
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
    console.log("*******************************************************");
  })
  .catch(function(e) {
    // There was an error! Handle it.
    console.log("*******************************************************");
    console.log("Transaction unsuccessful!");
    console.log(e);
    console.log("*******************************************************");
  });

SplitStealContractV2.deployed()
  .then(function(instance) {
    return instance.getLastFiveGamesLoop(3);
  })
  .then(function(result) {
    console.log("*******************************************************");
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result);
    console.log("*******************************************************");
  })
  .catch(function(e) {
    console.log("*******************************************************");
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
    console.log("*******************************************************");
  });
