const artifacts = require("../build/contracts/SplitStealContract.json");
const contract = require("truffle-contract");
const SplitStealContract = contract(artifacts);
SplitStealContract.setProvider(web3.currentProvider);
//You will have to pad zeroes on the left until it is 256 bits, so 16 hex values
//Works for +ve numbers
function leftpad(str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = " ";
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

function hash(arg) {
  if (typeof arg === "number") {
    if (arg < 0) {
      return leftPad((arg >>> 0).toString(16), 64, "F");
    }
    return leftPad(arg.toString(16), 64, 0);
  }
}

SplitStealContract.deployed()
  .then(function(instance) {
    var choice = 10;

    //That's how you calculate web3.sha3 from DApp and send to Smart contract
    console.log(
      web3.sha3(leftpad(choice.toString().toString(16), 64, 0), {
        encoding: "hex"
      })
    );

    return instance.getGameState.call();
  })
  .then(function(result) {
    // If this callback is called, the transaction was successfully processed.
    console.log("Transaction successful!");
    console.log(result[0].toNumber());
  })
  .catch(function(e) {
    // There was an error! Handle it.
    console.log("Transaction unsuccessful!");
    console.log(e);
  });
