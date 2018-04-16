pragma solidity ^0.4.21;

contract owned {
    
    address owner;
    modifier onlyOwner()
    {
        require(msg.sender == owner);
        _;
    }
}

contract priced {

    modifier costs(uint256 price) {
        require(msg.value >= price);
        _;
    }
}

contract SplitStealContract is owned, priced {

    //Global Variables
    bool registerationOpen = false;
    bool playStarted = false;
    bool lastGameFinished = true;
    bool revealing = false;
    uint256 REGISTRATION_COST = 5 * 10**14; // 0.0005 Ether
    uint256 MINIMUM_COST_OF_BET = 10**16; // 0.01 Ether
    uint constant STEAL = 0;
    uint constant SPLIT = 1;
    
    //Events
    event RegisterationOpened(uint256 _time_open_for);
    event Registered(address _player);
    event RegisterationClosed();
    event PlayStarted(uint256 _time_open_for);
    event Played(address _player, uint choice, uint256 _betAmount);
    event PlayStopped();
    event GameFinished(address[2][] _matches, uint256[2][] _bets);
    event Transferred(address _from, address _to, uint256 _amount);
    
    //BET Struct
    struct Bet {
        uint choice;
        uint256 betAmount;
    }

    //GAME Struct
    struct Game {
        address[] players; 
        address[] finalPlayers; 
        address[] notPlayedPlayers; 
        mapping(address=>bool) registered;
        mapping(address=>bool) played;
        mapping(address=>Bet) bets;
        address[2][] matches;
        uint[2][] pairedBets;

    }

    Game currentGame;

    function SplitStealContract() public {
        owner = msg.sender;
    }   

    function changeOwner(address _to) public onlyOwner {
        owner = _to;
    }

    function changeRegisterationCost(uint256 _to) public onlyOwner {
        require(_to > 0);
        REGISTRATION_COST = _to;
    }

    function changeMinumumBet(uint256 _to) public onlyOwner {
        require(_to > 0);
        MINIMUM_COST_OF_BET = _to;
    }

    function startRegistration() public onlyOwner {
        require(!playStarted);
        require(!registerationOpen);
        require(lastGameFinished);
        lastGameFinished = false;
        registerationOpen = true;
        currentGame = Game(new address[](0), new address[](0), new address[](0), new address[2][](0), new uint[2][](0));
        emit RegisterationOpened(30);
    }

    function register() public payable costs(REGISTRATION_COST) {
        require(registerationOpen);
        require(!currentGame.registered[msg.sender]);
        owner.transfer(msg.value);
        currentGame.registered[msg.sender] = true;
        currentGame.players.push(msg.sender);
        emit Registered(msg.sender);
    }

    function stopRegisteration() public onlyOwner {
        require(registerationOpen);
        registerationOpen = false;
        emit RegisterationClosed();
    }

    function startPlay() public onlyOwner {
        require(!playStarted);
        playStarted = true;
        emit PlayStarted(30);
    }

    function bet(uint _choice, uint256 _betAmount) public payable costs(_betAmount) {
        require(currentGame.registered[msg.sender]);
        require(!currentGame.played[msg.sender]);
        require(playStarted);
        owner.transfer(msg.value);
        currentGame.played[msg.sender] = true;
        currentGame.bets[msg.sender] = Bet(_choice, _betAmount);
        currentGame.finalPlayers.push(msg.sender);
        emit Played(msg.sender, _choice, _betAmount);
    }

    function stopPlay() public onlyOwner {
        require(playStarted);
        playStarted = false;
        emit PlayStopped();
    }

    function getPlayerCount(Game _game) private pure returns(uint count) {
        return _game.players.length;
    }

    function getFinalPlayerCount(Game _game) private pure returns(uint count) {
        return _game.finalPlayers.length;
    }

    function calculateReward(uint256 _x, uint256 _y) private pure returns (uint256 _reward) {
        //F(x,y) = Reward Function
        //TODO : WORK ON THIS
        return (_x + _y / 2);
    }

    function ethTransfer(address _to, uint256 _amount) private onlyOwner {
        require(_amount > 0);
        require(owner.balance > _amount);
        require(_to != address(0));
        _to.transfer(_amount);
        emit Transferred(owner, _to, _amount);
    }

    function reveal() public onlyOwner {
        require(!playStarted);
        require(!registerationOpen);
        require(!lastGameFinished);
        require(!revealing);
        revealing = true;

        for ( uint index = 0; index < currentGame.finalPlayers.length; index = index + 2) {
            
            if( (index + 1) < currentGame.finalPlayers.length) {
                address player1 = currentGame.finalPlayers[index];
                address player2 = currentGame.finalPlayers[index + 1];
                currentGame.matches.push([player1, player2]);
                currentGame.pairedBets.push([currentGame.bets[player1].choice, currentGame.bets[player2].choice]);
            } else {
                address playerAddress = currentGame.finalPlayers[index];
                //ODD Player reward him since player incurred gas to play.
                ethTransfer(currentGame.finalPlayers[index], REGISTRATION_COST + currentGame.bets[playerAddress].betAmount);
            }  
        }
        
        for ( index = 0 ; index < currentGame.pairedBets.length; index++ ) {

            player1 = currentGame.matches[index][0];
            player2 = currentGame.matches[index][1];

            if ( currentGame.pairedBets[0][index] == SPLIT && currentGame.pairedBets[1][index] == SPLIT ) {
                //GameOwner has to give back betAmounts along with reward to both players
                //Both players won
                uint256 reward = calculateReward(currentGame.bets[player1].betAmount, currentGame.bets[player2].betAmount);
                uint256 playerReward = reward / 2;
                ethTransfer(player1, playerReward);
                ethTransfer(player2, playerReward);
                continue;
            }
            if( currentGame.pairedBets[index][0] == SPLIT && currentGame.pairedBets[index][1] == STEAL ) {
                //matches[index][1] won and will get it's betAmount along with matches[index][0]'s betAmount
                uint256 loosersBetAmount = currentGame.bets[player1].betAmount;
                uint256 winnersBetAmount = currentGame.bets[player2].betAmount;
                ethTransfer(player2, loosersBetAmount + winnersBetAmount);
                continue;
            }
            if( currentGame.pairedBets[index][0] == STEAL && currentGame.pairedBets[index][1] == SPLIT ) {
                //matches[index][0] won and will get it's betAmount along with matches[index][1]'s betAmount
                loosersBetAmount = currentGame.bets[player2].betAmount;
                winnersBetAmount = currentGame.bets[player1].betAmount;
                ethTransfer(player1, loosersBetAmount + winnersBetAmount);
                continue;
            }
            if( currentGame.pairedBets[index][0] == STEAL && currentGame.pairedBets[index][1] == STEAL ) {
                //GameOwner has alrady collected there betAmounts
                //Both player loose
                continue;
            }
        }

        lastGameFinished = true;
        revealing = false;
        emit GameFinished(currentGame.matches, currentGame.pairedBets);
    }

}

