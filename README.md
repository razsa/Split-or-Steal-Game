# Split-or-Steal-Game

DAPP [Game](http://showmeyourcode.github.io/Split-or-Steal-Game/) on ethereum blockchain deployed at [Main Ethereum Network](https://etherscan.io/address/0xa69610b60fec5ec350a7267ed5d47bf87aa25364) and [Rinkeby Test Network](https://rinkeby.etherscan.io/address/0x6cf35ea8150ada482b1f0615d850f11e4127adb5).

[About Game](http://showmeyourcode.github.io/Split-or-Steal-Game/#about)

<a href="https://www.youtube.com/watch?v=RtQcZsu6Ls0&feature=youtu.be" target="_blank"><img src="https://user-images.githubusercontent.com/6779070/40848393-bfbd6a96-65dc-11e8-8f86-4bd4f8ecbfe0.png" 
alt="How to Play" width="640" height="352" border="10" /></a>



**Play game on your local**
* ```git clone https://github.com/showmeyourcode/Split-or-Steal-Game.git```
* ```cd Split-or-Steal-Game```
* ```cd dapp```
* ```npm install```
* ```npm start```

**What all helped build this**
* Gitter community for [web3.js](https://gitter.im/ethereum/web3.js) & [Solidity](https://gitter.im/ethereum/solidity)
* [Solidity Documentation](https://solidity.readthedocs.io/en/v0.4.24/)
* [This](https://karl.tech/learning-solidity-part-2-voting/) blog post explaining commit reveal
* [Firebase](https://firebase.google.com/docs/database/?gclid=EAIaIQobChMI9YTWsuus2wIVEiUrCh3ATwYBEAAYASABEgIeiPD_BwE)
* [Google Analytics](https://analytics.google.com/analytics/web/)
* [gh-pages](https://www.npmjs.com/package/gh-pages)
* [React](https://www.npmjs.com/package/react)
* [react-facebook](https://www.npmjs.com/package/react-facebook)
* [react-ga](https://www.npmjs.com/package/react-ga)
* [react-input-autosize](https://www.npmjs.com/package/@elsdoerfer/react-input-autosize)



**How to test smart contract**

_Prerequisite_

DOWNLOAD and RUN [Ganache](http://truffleframework.com/ganache/)

**USING REMIX**

* Open [remix(v0.4.21)](http://remix.ethereum.org/)
* Copy Paste [contract](https://github.com/showmeyourcode/Split-or-Steal-Game/blob/master/truffle/contracts/SplitStealContract.sol) in remix IDE
* Go to _Run_ tab and in _Environment_ select _Web3 Provider_
* Provide endpoint as http://localhost:7545 (That's where Ganache is running)
* In _Run_ tab under _Accounts_ you should see a lot of accounts with some ether.
* Select any account and hit **Create** at bottom.
* Now you should see all the methods listed.
* Just go ahead and play the game by hitting appropriate method in game play.
* Do not forget to mention _Value_ in wei/ether while hitting a payble contract method.

![DAPP Game on ethereum blockchain](https://imgur.com/vtJqBTM.jpg)
