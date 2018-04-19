# Split-or-Steal-Game
DAPP Game on ethereum blockchain

![DAPP Game on ethereum blockchain](https://imgur.com/M9tQP6X.jpg)

**What is the game?**

It is a two player game(X, Y) where each player is asked to bet some amount(X, Y) to play the game.
Both the player know the amount each one of them has bet.

Based on X and Y, Smart contract would generate a Reward Matrix based on which game will be played.

As of now Parameterised Reward Matrix function is as follows,

**R(X,Y,n1,n2,n3,d)** =>

(X/Y)|Split|Steal
:---: | :---: | :---:
Split|<a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n1}{d}*Y)&space;/&space;Y&space;&plus;&space;(\frac{n1}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n1}{d}*Y)&space;/&space;Y&space;&plus;&space;(\frac{n1}{d}*X)" title="X + (\frac{n1}{d}*Y) / Y + (\frac{n1}{d}*X)" /></a>|<a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d}*X)&space;/&space;Y&space;&plus;&space;(\frac{n2}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d}*X)&space;/&space;Y&space;&plus;&space;(\frac{n2}{d}*X)" title="(\frac{n1}{d}*X) / Y + (\frac{n2}{d}*X)" /></a>
Steal|<a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n2}{d}*Y)&space;/&space;(\frac{n1}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n2}{d}*Y)&space;/&space;(\frac{n1}{d}*Y)" title="X + (\frac{n2}{d}*Y) / (\frac{n1}{d}*Y)" /></a>|<a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n3}{d}*X)&space;/&space;(\frac{n3}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n3}{d}*X)&space;/&space;(\frac{n3}{d}*Y)" title="(\frac{n3}{d}*X) / (\frac{n3}{d}*Y)" /></a>

**where**, 
 - X & Y are bet amounts by PlayerX and PlayerY respectively.
 - n1,n2,n3,d are +ve integers
 - n1<n3<n2
 - n1 + n2 = d
 - n1,n2,n3 < d


**How to read Reward Matrix case by case?**

1. If X chooses to SPLIT and Y also chooses to SPLIT, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n1}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n1}{d}*Y)" title="X + (\frac{n1}{d}*Y)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=Y&space;&plus;&space;(\frac{n1}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?Y&space;&plus;&space;(\frac{n1}{d}*X)" title="Y + (\frac{n1}{d}*X)" /></a> amount respectively.
2. If X chooses to SPLIT and Y chooses to STEAL, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d}*X)" title="(\frac{n1}{d}*X)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=Y&space;&plus;&space;(\frac{n2}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?Y&space;&plus;&space;(\frac{n2}{d}*X)" title="Y + (\frac{n2}{d}*X)" /></a> amount respectively.
3. If X chooses to STEAL and Y chooses to SPLIT, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n2}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n2}{d}*Y)" title="X + (\frac{n2}{d}*Y)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d}*Y)" title="(\frac{n1}{d}*Y)" /></a> amount respectively.
4. If X chooses to STEAL and Y also chooses to STEAL, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n3}{d}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n3}{d}*X)" title="(\frac{n3}{d}*X)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n3}{d}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n3}{d}*Y)" title="(\frac{n3}{d}*Y)" /></a> amount respectively.


**How does contract earn?**

1. In case 1 contract losses <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d})(X&plus;Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d})(X&plus;Y)" title="(\frac{n1}{d})(X+Y)" /></a>
2. In case 2 contract neither wins nor looses.
3. In case 3 contract neither wins nor looses.
4. In case 3 contract wins <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{d-n3}{d})(X&plus;Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{d-n3}{d})(X&plus;Y)" title="(\frac{d-n3}{d})(X+Y)" /></a>

**GAME PLAY**

- Game has 5 Phases

  - **Registeration & Commit Bets (PLAYER ROUND)**

    - This phase would be opened by contract owner for a fixed amount of time. (START)
    - An event will be fired when Registration starts.(EVENT)
    - Players will submit their bet amounts in the given time. **(THIS WOULD COST GAS)**
    - Player will be also be dynamically grouped in a pair of 2 as they are submitting the bets.
    - An event will be fired when two players are paired with each other.
    - Only player who could successfully submit bets in the given time, will be eligible to play the game.
    - Once this phase is marked over by contract owner no more bets will be accepted. (STOP)
    - An event will be fired when registration closes. (EVENT)

  - **Reveal Reward Matrix (DAPP ROUND)**

    - This phase is not actually opened by contract owner.
    - As soos as DApp receives the event of Pairing of two users, Dapp would read Reward Matrix from Contract and display to the user.  **(THIS WOULD *NOT* COST GAS)**

  - **Submit encrypted *steal* or *split* choice (PLAYER ROUND)**

    - Players will be given fixed amount of time to analyse Reward matrix. (Say 20 confirmations of Registration Closed Transaction.)
    - This phase would be opened by contract owner for a fixed amount of time. (START)
    - An event will be fired when Registration starts.(EVENT)
    - Player will submit encrypted(this is done by DApp, players simply need to choose any **ODD** number for **SPLIT** or any **EVEN** number for **STEAL**) choices. **(THIS WOULD COST GAS)**
    - Once this phase is marked over by contract owner no more encrypted choice submissions will be accepted. (STOP)
    - An event will be fired when encrypted choice submission ends. (EVENT)

  - **Reveal choice  (PLAYER ROUND)**

    - This phase would be opened by contract owner for fixed amount of time. (START)(EVENT) 
    - Player will submit unencrypted choice, i.e. the number (even or odd) they actually chose in previous round. **(THIS WOULD COST GAS)**
    - When player submits the choice, contract would evaluate the encryption of the choice and compare with previously submitted choice.
    - If Both do not match, player will be marked disqualified for that game and an event will be fired.(EVENT)
    - Once this phase is marked over by contract owner no more unencrypted choice submissions will be accepted. (STOP)
    - An event will be fired when Reveal Choice Submission ends. (EVENT)

  - **Claim Reward Winners ( PLAYER ROUND)**

    - This phase would be opened by contract owner. (START)(EVENT)   
    - Contract would check player claiming reward for certain conditions including disqualified.
    - Only if player passes all teh conditions, player will receive his reward as per reward matrix.
    

**How to run tests**

*Prerequisite*

Download and run [Ganache](http://truffleframework.com/ganache/)


**USING REMIX**


 - Open [remix(v0.4.21)](http://remix.ethereum.org/#optimize=false&version=soljson-v0.4.21+commit.dfe3193c.js)
 - Copy Paste [contract](https://github.fkinternal.com/raw/Flipkart/Split-or-Steal-Game/master/truffle/contracts/SplitStealContract.sol?token=AAAIJnbD-c_quCN6andhH_HoMyXFXoYUks5a30O3wA%3D%3D) in remix IDE
 - Go to *Run* tab and in *Environment* select *Web3 Provider*
 - Provide endpoint as http://localhost:7545 (That's where Ganache is running)
 - In *Run* tab under *Accounts* you should see a lot of accounts with some ether.
 - Select any account and hit **Create** at bottom.
 - Now you should see all the methods listed.
 - Just go ahead and play the game by hitting appropriate method in game play.
 - Do not forget to mention *Value* in wei/ether while hitting a payble contract method.
 


**USING Truffle**


 - Go to truffle folder
 ```shell
 cd truffle
 ```
 - Compile
```shell
truffle compile
```
 - Migrate
```shell
truffle migrate --reset
```
 - Open truffle console
```shell
truffle console
```
 - Run Tests
```shell
>exec <PATH TO TEST>/TestStartRegistration.js
```
