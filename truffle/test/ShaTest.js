
//You will have to pad zeroes on the left until it is 256 bits, so 16 hex values
//Works for +ve numbers
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

//Let choice be 9
var choice = 0;

//That's how you calculate web3.sha3 from DApp and send to Smart contract
web3.sha3(leftpad((choice.toString()).toString(16), 64, 0), {encoding: 'hex'})