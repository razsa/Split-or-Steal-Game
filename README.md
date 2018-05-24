# Split-or-Steal-Game

DAPP [Game](http://showmeyourcode.github.io/Split-or-Steal-Game/) on ethereum blockchain deployed at [Main Ethereum Network](https://etherscan.io/address/0xa69610b60fec5ec350a7267ed5d47bf87aa25364) and [Rinkeby Test Network](https://rinkeby.etherscan.io/address/0x6cf35ea8150ada482b1f0615d850f11e4127adb5).

[How to Play](http://showmeyourcode.github.io/Split-or-Steal-Game/#about)

![DAPP Game on ethereum blockchain](https://imgur.com/vtJqBTM.jpg)

**How to run tests**

_Prerequisite_

Download and run [Ganache](http://truffleframework.com/ganache/)

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

**USING Truffle**

* Go to truffle folder

```shell
cd truffle
```

* Compile

```shell
truffle compile
```

* Migrate

```shell
truffle migrate --reset
```

* Open truffle console

```shell
truffle console
```

* Run Tests

```shell
>exec <PATH TO TEST>/TestStartRegistration.js
```
