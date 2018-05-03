# Split-or-Steal-Game
DAPP Game on ethereum blockchain

**What is the game?**

It is a two player game(X, Y) where each player is asked to bet some amount(X, Y) to play the game.
Both the player know the amount each one of them has bet.

Based on X and Y, Smart contract would generate a Reward Matrix based on which game will be played.

As of now Parameterised Reward Matrix function is as follows,

**R(X,Y,k)** =>

(X/Y)|Split|Steal
:---: | :---: | :---:
Split|(X+Y)/2|0 \ (K*Y)/100
Steal|(K*X)/100 \ 0|Max(0, X-Y)

**where**, 
 - X & Y are bet amounts by PlayerX and PlayerY respectively.
 - K > 100



**How to read Reward Matrix case by case?**

1. If X chooses to SPLIT and Y also chooses to SPLIT, then they win (X+Y)/ 2 each, thus player betting lower wins.
2. If X chooses to SPLIT and Y chooses to STEAL, then Y wins K % of Y and X gets 0, thus the higher you bet higher you win.
3. If X chooses to STEAL and Y chooses to SPLIT, then X wins K % of X and Y gets 0, thus the higher you bet higher you win.
4. If X chooses to STEAL and Y also chooses to STEAL, then they win Max(0, X-Y), thus player betting higher gets some part back.


**How does contract earn?**

1. In case 1 contract neither wins nor looses.
2. In case 2 & 3 contract wins based on who won the game and how much did the winner bet in comparision to looser.
4. In case 4 contract wins 2 time Y where Y is the lower bet.

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
