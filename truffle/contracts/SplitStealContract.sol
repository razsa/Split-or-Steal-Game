pragma solidity ^0.4.22;

//TODO : Handle suspended users for all methods.
//TODO : Store Games in a Map instead of array. See if that has any advantages.
//TODO : Sequence of transactions on blockchain explorer is easy way of figuring out how much your opponent bet

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
    bool revealing = false;
    bool lastGameFinished = true;
    uint constant STEAL = 0;
    uint constant SPLIT = 1;
    mapping(address=>bool) suspended;

    //Game Rules
    uint256 REGISTRATION_COST = 5 * 10**14;// 0.0005 Ether
    uint256 MINIMUM_COST_OF_BET = 10**17;// 0.1 Ether
    uint256 MAXIMUM_COST_OF_BET = 5 * 10**18;//5 Ether

    //Reward Matrix Parameters
    uint256 K = 25;
    uint256 ODD_PLAYER_BONUS_PERCENT = 10;

    
    //Events
    event RegisterationOpened(uint indexed _gameNumber);
    event Registered(uint indexed _gameNumber, address indexed _player, uint256 _betAmount);
    event RegisterationClosed(uint indexed _gameNumber);
    event PlayStarted(uint indexed _gameNumber);
    event Played(uint indexed _gameNumber, address _player, bytes32 _encryptedChoice);
    event PlayStopped(uint indexed _gameNumber);
    event RevealStart(uint indexed _gameNumber);
    event RevealStop(uint indexed _gameNumber);
    event Transferred(uint indexed _gameNumber,address _to, uint256 _amount);
    event Paired(uint indexed _gameNumber, address indexed _player1, address indexed _player2, uint256 betAmount1, uint256 betAmount2);
    event Disqualified(uint indexed _gameNumber, address indexed _player, bytes32 _encryptedChoice, uint _actualChoice, bytes32 _encryptedActualChoice);
    event NewGameRules(uint _oldFees, uint _newFees, uint _oldMinBet, uint _newMinBet, uint _oldMaxBet, uint _newMaxBet);
    event NewRewardMatrix(uint _n1, uint _n2, uint _n3, uint _d);
    event NewRewardPercentage(uint256 _oldK, uint256 _k);
    event NewOddPlayerBonus(uint256 _fromPercentage, uint256 _toPercentage);
    event Suspended(address indexed _player);
    event UnSuspended(address indexed _player);

    //BET Struct
    struct Bet {
        bytes32 encryptedChoice;
        uint256 betAmount;
        uint actualChoice;
    }

    //GAME Struct
    struct Game {
        address[] players; 
        uint256 registrationCost;
        uint256 oddPlayerBonusPercent;
        uint256 k;
        mapping(address=>bool) registered;
        mapping(address=>bool) played;
        mapping(address=>Bet) bets;
        mapping(address=>address) pairs;
        mapping(address=>bool) revealed;
        mapping(address=>bool) disqualified;
        mapping(address=>bool) claimedReward;
        mapping(address=>uint256) reward;
    }

    //All Games played
    Game[] games;

    //Current Game index
    uint gameIndex;

    constructor() public {
        owner = msg.sender;
    }   

    function fund() payable external {
    }

    // UTILITY METHODS STARTS
    function isEven(uint num) private pure returns(bool _isEven) {
        uint halfNum = num / 2;
        return (halfNum * 2) == num;
    }
    // UTILITY METHODS END

    // ADMIN METHODS START
    function changeOwner(address _to) public onlyOwner {
        require(_to != address(0));
        owner = _to;
    }

    function transferBalanceToOwner() public onlyOwner {
        transferToOwner(address(this).balance);
    }
    
    function transferToOwner(uint256 amountInWei) public onlyOwner {
        require(address(this).balance >= amountInWei);
        owner.transfer(amountInWei);
    }

    function suspend(address _player) public onlyOwner returns(bool _suspended){
        require(!suspended[_player]);
        suspended[_player] = true;
        emit Suspended(_player);
        return true;
    }

    function unSuspend(address _player) public onlyOwner returns(bool _unSuspended){
        require(suspended[_player]);
        suspended[_player] = false;
        emit UnSuspended(_player);
        return true;
    }

    function setOddPlayerBonusPercent(uint256 _percentage) public onlyOwner {
        require(_percentage >= 0);
        emit NewOddPlayerBonus(ODD_PLAYER_BONUS_PERCENT, _percentage);
        ODD_PLAYER_BONUS_PERCENT = _percentage;
    }

    function setRewardPercentageK(uint256 _k) public onlyOwner {
        require(_k >= 0);
        emit NewRewardPercentage(K, _k);
        K = _k;
    }

    function setGameRules(uint256 _fees, uint256 _minBet, uint256 _maxBet) public onlyOwner {
        require(_fees >= 0);
        require(_minBet >= 0);
        require(_maxBet >= 0);
        emit NewGameRules(REGISTRATION_COST, _fees, MINIMUM_COST_OF_BET, _minBet, MAXIMUM_COST_OF_BET, _maxBet);
        REGISTRATION_COST = _fees;
        MINIMUM_COST_OF_BET = _minBet;
        MAXIMUM_COST_OF_BET = _maxBet;
    }


    //ADMIN METHODS STOP

    //VIEW APIs STARTS

    function getOwner() public view returns(address _owner) {
        return owner;
    }

    function getContractBalance() public view returns(uint256 _balance) {
        return address(this).balance;
    }

    function getRewardMatrix() public view returns(uint _k, uint _oddPlayerBonusPercentage) {
        return (K, ODD_PLAYER_BONUS_PERCENT);
    }

    function getGameRules() public view returns(uint256 _fees, uint256 _minBet, uint256 _maxBet) {
        return (REGISTRATION_COST, MINIMUM_COST_OF_BET, MAXIMUM_COST_OF_BET);
    }

    function getGameState() public view returns(uint256 _gameNumber, bool _registerationOpen, bool _playStarted, bool _revealing, bool _lastGameFinished, uint256 _totalPlayers) {
        uint totalPlayers = 0;
        if (games.length > 0) {
            totalPlayers = games[games.length-1].players.length;
        }
        return (games.length, registerationOpen, playStarted, revealing, lastGameFinished, totalPlayers);
    }

    function getPlayerState(uint gameNumber) public view returns(bool _suspended, bool _registered, bool _played, bool _revealed, bool _disqualified, bool _claimedReward,  address _opponent, uint256 _betAmount, uint256 _reward) {
        require(games.length >= gameNumber);
        uint index = gameNumber - 1;
        address player = msg.sender;
        address opponent = games[index].pairs[player];
        uint256 betAmount = games[index].bets[player].betAmount;
        uint256 opponentBetAmount = 0;
        if (opponent != address(0)) {
            opponentBetAmount = games[index].bets[opponent].betAmount;
        }
        return (suspended[player], games[index].registered[player], games[index].played[player], games[index].revealed[player], games[index].disqualified[player], games[index].claimedReward[player], opponent, betAmount, games[index].reward[player] );
    }
    //VIEW APIs ENDS

    //GAME PLAY STARTS
    function startRegistration() public onlyOwner {
        require(!playStarted);
        require(!registerationOpen);
        require(lastGameFinished);
        lastGameFinished = false;
        registerationOpen = true;
        games.push(Game(new address[](0), REGISTRATION_COST, ODD_PLAYER_BONUS_PERCENT, K));
        gameIndex = games.length - 1;
        emit RegisterationOpened(games.length);
    }

    function bet(uint256 _betAmount) public payable costs(_betAmount) returns(bool _accepted) {
        require(!suspended[msg.sender]);
        require(_betAmount >= MINIMUM_COST_OF_BET);
        require(_betAmount <= MAXIMUM_COST_OF_BET);
        require(registerationOpen);
        require(!games[gameIndex].registered[msg.sender]);
        games[gameIndex].registered[msg.sender] = true;
        games[gameIndex].bets[msg.sender] = Bet("",_betAmount,0);
        games[gameIndex].players.push(msg.sender);
        uint totalPlayers = games[gameIndex].players.length;
        if( isEven(totalPlayers) && totalPlayers != 0) {
            address player1 = games[gameIndex].players[totalPlayers-2];
            address player2 = games[gameIndex].players[totalPlayers-1];  
            games[gameIndex].pairs[player1] = player2;
            games[gameIndex].pairs[player2] = player1;
            emit Paired(games.length, player1, player2, games[gameIndex].bets[player1].betAmount, _betAmount);
        }
        emit Registered(games.length, msg.sender, _betAmount);
        return true;
    }

    function startPlay() public onlyOwner {
        require(registerationOpen);
        require(!playStarted);
        playStarted = true;
        registerationOpen = false;
        emit RegisterationClosed(games.length);
        emit PlayStarted(games.length);
    }

    function submit(bytes32 _encryptedChoice) public returns(bool _accepted)  {
        require(games[gameIndex].registered[msg.sender]);
        require(!games[gameIndex].played[msg.sender]);
        require(playStarted);
        games[gameIndex].played[msg.sender] = true;
        games[gameIndex].bets[msg.sender].encryptedChoice = _encryptedChoice;
        emit Played(games.length, msg.sender, _encryptedChoice);
        return true;
    }

    function startReveal() public onlyOwner {
        require(playStarted);
        require(!revealing);
        playStarted = false;
        revealing = true;
        emit PlayStopped(games.length);
        emit RevealStart(games.length);
    }

    function reveal(uint256 _choice) public returns(bool _accepted){
        require(games[gameIndex].registered[msg.sender]);
        require(games[gameIndex].played[msg.sender]);
        require(!games[gameIndex].revealed[msg.sender]);
        require(revealing);
        games[gameIndex].revealed[msg.sender] = true;
        games[gameIndex].bets[msg.sender].actualChoice = _choice;
        bytes32 encryptedChoice = games[gameIndex].bets[msg.sender].encryptedChoice;
        bytes32 encryptedActualChoice = keccak256(_choice);
        if( encryptedActualChoice != encryptedChoice) {
            games[gameIndex].disqualified[msg.sender] = true;
            emit Disqualified(games.length, msg.sender, encryptedChoice, _choice, encryptedActualChoice);
            return false;
        }
        return true;
    }

    function stopReveal() public onlyOwner {
        require(revealing);
        revealing = false;
        lastGameFinished = true;
        emit RevealStop(games.length);
    }

    //GAME PLAY STOPS


    //REWARD WITHDRAW STARTS
    function ethTransfer(uint gameNumber, address _to, uint256 _amount) private {
        require(!suspended[_to]);
        require(_amount > 0);
        require(_to != address(0));
        //Take game Commission
        uint256 amount = _amount - games[gameNumber-1].registrationCost;
        require(address(this).balance >= amount);
        _to.transfer(amount);
        emit Transferred(gameNumber, _to, amount);
    }


    //Withdraw Reward Amount
    function claimRewardK(uint gameNumber) public returns(bool _claimedReward)  {
        require(lastGameFinished || games.length > gameNumber);
        Game storage game = games[gameNumber-1];
        require(!game.disqualified[msg.sender]);
        require(game.registered[msg.sender]);
        require(game.played[msg.sender]);
        require(game.revealed[msg.sender]);
        require(!game.claimedReward[msg.sender]);
        
        address player1 = msg.sender;
        address player2 = game.pairs[player1];
        uint256 reward = 0;
        uint256 gameReward = 0;
        uint256 totalBet = (game.bets[player1].betAmount + game.bets[player2].betAmount);
        if (player2 == address(0)) {
            //Odd Player1 , Pay back.
            //Give back extra % of bet amount
            //Unlucky Bonus
            reward = ((100 + game.oddPlayerBonusPercent) * game.bets[player1].betAmount) / 100;
            ethTransfer(gameNumber, player1, reward);
            game.reward[player1] = reward;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( game.disqualified[player2] || !game.revealed[player2] || !game.played[player2]) {
            gameReward = ((100 + game.k) * game.bets[player1].betAmount) / 100;
            reward = gameReward < totalBet ? gameReward : totalBet; //Min (X+Y, (100+K)*X/100)
            ethTransfer(gameNumber, player1, reward);
            game.reward[player1] = reward;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( !isEven(game.bets[player1].actualChoice) && !isEven(game.bets[player2].actualChoice) ) { // Split Split
            reward = (game.bets[player1].betAmount + game.bets[player2].betAmount) / 2;
            ethTransfer(gameNumber, player1, reward);
            game.reward[player1] = reward;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( !isEven(game.bets[player1].actualChoice) && isEven(game.bets[player2].actualChoice) ) { // Split Steal
            game.reward[player1] = 0;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( isEven(game.bets[player1].actualChoice) && !isEven(game.bets[player2].actualChoice) ) { // Steal Split
            gameReward = (((100 + game.k) * game.bets[player1].betAmount)/100);
            reward = gameReward < totalBet ? gameReward : totalBet; //Min (X+Y, (100+K)*X/100)
            ethTransfer(gameNumber, player1, reward);
            game.reward[player1] = reward;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( isEven(game.bets[player1].actualChoice) && isEven(game.bets[player2].actualChoice) ) { // Steal Steal
            reward = 0;
            if( game.bets[player1].betAmount > game.bets[player2].betAmount) {
                gameReward = ((100 + game.k) * (game.bets[player1].betAmount - game.bets[player2].betAmount)) / 100;
                reward = gameReward < totalBet ? gameReward : totalBet; //Min (X+Y, (100+K)*(X-Y)/100)
            }
            if(reward > 0) {
                ethTransfer(gameNumber, player1, reward);
            }
            game.reward[player1] = reward;
            game.claimedReward[msg.sender] = true;
            return true;
        }
    }

    //REWARD WITHDRAW ENDS

}