# Split-or-Steal-Game
DAPP Game on ethereum blockchain

**What is the game?**

It is a two player game(X, Y) where each player is asked to bet some amount(X, Y) on the table to play the game.
Both the player know the amount each one of them has bet.

Based on X and Y, Smart contract would generate a Reward Matrix based on which game will be played.

As of now Parameterised Reward Matrix function is as follows,

**R(X,Y,n1,n2,d1, d2)** =>

(X/Y)|Split|Steal
:---: | :---: | :---:
Split|<a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n1}{d1}*Y)&space;/&space;Y&space;&plus;&space;(\frac{n1}{d1}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n1}{d1}*Y)&space;/&space;Y&space;&plus;&space;(\frac{n1}{d1}*X)" title="X + (\frac{n1}{d1}*Y) / Y + (\frac{n1}{d1}*X)" /></a>|<a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d1}*X)&space;/&space;Y&space;&plus;&space;(\frac{n2}{d1}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d1}*X)&space;/&space;Y&space;&plus;&space;(\frac{n2}{d1}*X)" title="(\frac{n1}{d1}*X) / Y + (\frac{n2}{d1}*X)" /></a>
Steal|<a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n2}{d1}*Y)&space;/&space;(\frac{n1}{d1}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n2}{d1}*Y)&space;/&space;(\frac{n1}{d1}*Y)" title="X + (\frac{n2}{d1}*Y) / (\frac{n1}{d1}*Y)" /></a>|<a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{1}{d2}*X)&space;/&space;(\frac{1}{d2}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{1}{d2}*X)&space;/&space;(\frac{1}{d2}*Y)" title="(\frac{1}{d2}*X) / (\frac{1}{d2}*Y)" /></a>

where, 
 - X & Y are bet amounts by PlayerX and PlayerY respectively.
 - n1,n2,d1,d2 are +ve integers
 - n1<n2
 - n1 + n2 = d1
 - d1>d2


**What is Reward Matrix?**

1. If X chooses to SPLIT and Y also chooses to SPLIT, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n1}{d1}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n1}{d1}*Y)" title="X + (\frac{n1}{d1}*Y)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=Y&space;&plus;&space;(\frac{n1}{d1}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?Y&space;&plus;&space;(\frac{n1}{d1}*X)" title="Y + (\frac{n1}{d1}*X)" /></a> amount respectively.
2. If X chooses to SPLIT and Y chooses to STEAL, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d1}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d1}*X)" title="(\frac{n1}{d1}*X)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=Y&space;&plus;&space;(\frac{n2}{d1}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?Y&space;&plus;&space;(\frac{n2}{d1}*X)" title="Y + (\frac{n2}{d1}*X)" /></a> amount respectively.
3. If X chooses to STEAL and Y chooses to SPLIT, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=X&space;&plus;&space;(\frac{n2}{d1}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?X&space;&plus;&space;(\frac{n2}{d1}*Y)" title="X + (\frac{n2}{d1}*Y)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{n1}{d1}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{n1}{d1}*Y)" title="(\frac{n1}{d1}*Y)" /></a> amount respectively.
4. If X chooses to STEAL and Y also chooses to STEAL, then they win <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{1}{d2}*X)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{1}{d2}*X)" title="(\frac{1}{d2}*X)" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=(\frac{1}{d2}*Y)" target="_blank"><img src="https://latex.codecogs.com/png.latex?(\frac{1}{d2}*Y)" title="(\frac{1}{d2}*Y)" /></a> amount respectively.



**GAME PLAY**

- Game has 6 Phases

  - **Registeration & Commit Bets (PLAYER ROUND)**

    - This phase would be opened by contract owner for a fixed amount of time. (START)(EVENT)
    - Players will submit their bet amounts(B(i)) in the given time. **(THIS WOULD COST GAS)**
    - Only player who could successfully submit bets in the given time, will be eligible to play the game.
    - Once this phase is marked over by contract owner no more bets will be accepted. (STOP)
    - Also an event will be fired. (EVENT)

  - **Grouping and Reward Matrix Calulation (ADMIN ROUND)**

    - This phase would be opened by contract owner. (START)(EVENT)
    - Players will be grouped in a group of 2.
    - Contract would calculate reward matrix for each group.
    - An event will be fired when groupig and reward matrix calulation is complete. (EVENT)

  - **Reveal Reward Matrix (DAPP ROUND)**

    - This phase is not actually opened by contract owner.
    - As soos as DApp receives the event of Grouping and Reward Calculation being over, Dapp woudl read Reward Matrix from Contract.  **(THIS WOULD NOT COST GAS)**

  - **Submit ecrypted steal or split choice (PLAYER ROUND)**

    - Players will be given fixed amount of time to analyse Reward matrix. (Say 20 confirmations of Grouping and Reward Matrix Calulation)
    - This phase would be opened by contract owner for a fixed amount of time. (START)(EVENT) 
    - Player will submit encrypted(this is done by DApp, players simply need to choose any odd number for split or any even number steal) choices. **(THIS WOULD COST GAS)**
    - Once this phase is marked over by contract owner no more encrypted choice submissions will be accepted. (STOP)
    - An event will be fired when Choice Submission ends. (EVENT)

  - **Reveal choice  (PLAYER ROUND)**

    - This phase would be opened by contract owner for fixed amount of time. (START)(EVENT) 
    - Player will submit unencrypted choice, i.e. the number (even or odd) they actually chose in previous round. **(THIS WOULD COST GAS)**
    - Once this phase is marked over by contract owner no more unencrypted choice submissions will be accepted. (STOP)
    - An event will be fired when Reveal Choice Submission ends. (EVENT)

  - **Reward Winners ( ADMIN ROUND)**

    - This phase would be opened by contract owner. (START)(EVENT)   
    - Contract would see if the players have submitted the actual number or not, by encrypting all players' choice and matching previous encrypted choice for all player.
    - If choices do not match, It would be considered that the player has cheated and player will be disqualified.
    - If the opponent is also disqualified both will loose their bet amount, else if oppponent's choice matches, irrespective of choice, opponent takes player's Bet amount. Reward Amount(*R*) is not used.
    - Contract would distribute amount according to above rules and Reward matrix to winners.
