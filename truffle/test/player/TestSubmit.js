function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

const artifacts = require('../../build/contracts/SplitStealContract.json')
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
    
    var choice = 2;
    //That's how you calculate web3.sha3 from DApp and send to Smart contract
    var encryptedChoice = web3.sha3(leftpad((choice.toString()).toString(16), 64, 0), {encoding: 'hex'})

    return instance.submit(encryptedChoice, {from: web3.eth.accounts[3], gas: 3000000});
  }).then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result); 
  }).catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  })
  