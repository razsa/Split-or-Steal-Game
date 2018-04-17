pragma solidity ^0.4.21;

//TODO : Max Amount Bet.
//TODO : Handle suspended users for all methods.
//TODO : Store Games in a Map instead of array. See if that has any advantages.

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
    uint256 REGISTRATION_COST = 5 * 10**14; // 0.0005 Ether
    uint256 MINIMUM_COST_OF_BET = 5 * 10**15; // 0.005 Ether
    uint256 ODD_PLAYER_BONUS_PERCENT = 10;
    uint constant STEAL = 0;
    uint constant SPLIT = 1;
    mapping(address=>bool) suspended;

    //Reward Matrix Parameters
    uint N1 = 1;
    uint N2 = 3;
    uint N3 = 2;
    uint D = 4;
    
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
    event NewRewardMatrix(uint _n1, uint _n2, uint _n3, uint _d);
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
        mapping(address=>bool) registered;
        mapping(address=>bool) played;
        mapping(address=>Bet) bets;
        mapping(address=>address) pairs;
        mapping(address=>bool) revealed;
        mapping(address=>bool) disqualified;
        mapping(address=>bool) claimedReward;
        
    }

    //All Games played
    Game[] games;

    //Current Game index
    uint gameIndex;

    function SplitStealContract() public {
        owner = msg.sender;
    }   

    // UTILITY METHODS STARTS

    function getContractBalance() public view returns(uint256 _balance) {
        return address(this).balance;
    }

    function changeOwner(address _to) public onlyOwner {
        owner = _to;
    }

    function isEven(uint num) private pure returns(bool _isEven) {
        uint halfNum = num / 2;
        return (halfNum * 2) == num;
    }

    function getTotalGames() public view returns(uint _size) {
        return games.length;
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

    function getOpponent(uint gameNumber) public view returns(address _opponent) {
        return games[gameNumber-1].pairs[msg.sender];
    }

    function getOddPlayerBonusPercent() public view returns(uint256 _oddPlayerBonusPercentage) {
        return ODD_PLAYER_BONUS_PERCENT;
    }

    function setOddPlayerBonusPercent(uint256 _percentage) public onlyOwner {
        uint256 oldPercentage = ODD_PLAYER_BONUS_PERCENT;
        ODD_PLAYER_BONUS_PERCENT = _percentage;
        emit NewOddPlayerBonus(oldPercentage, _percentage);
    }

    function getN1() public view returns(uint _n1){
        return N1;
    }

    function getN2() public view returns(uint _n2){
        return N2;
    }

    function getN3() public view returns(uint _n3){
        return N3;
    }

    function getD() public view returns(uint _d){
        return D;
    }

    function setRewardMatrix(uint _n1, uint _n2, uint _n3, uint _d) public onlyOwner {
        N1 = _n1;
        N2 = _n2;
        N3 = _n3;
        D = _d;
        emit NewRewardMatrix(N1, N2, N3, D);
    }

    // UTILITY METHODS STOPS

    //GAME PLAY STARTS

    function startRegistration() public onlyOwner {
        require(!playStarted);
        require(!registerationOpen);
        require(lastGameFinished);
        lastGameFinished = false;
        registerationOpen = true;
        games.push(Game(new address[](0), REGISTRATION_COST, ODD_PLAYER_BONUS_PERCENT));
        gameIndex = games.length - 1;
        emit RegisterationOpened(games.length);
    }

    function bet(uint256 _betAmount) public payable costs(_betAmount) returns(bool _accepted) {
        require(!suspended[msg.sender]);
        require(_betAmount > MINIMUM_COST_OF_BET);
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

    function stopRegisteration() public onlyOwner {
        require(registerationOpen);
        registerationOpen = false;
        emit RegisterationClosed(games.length);
    }

    function startPlay() public onlyOwner {
        require(!playStarted);
        playStarted = true;
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

    function stopPlay() public onlyOwner {
        require(playStarted);
        playStarted = false;
        emit PlayStopped(games.length);
    }

    function startReveal() public onlyOwner {
        require(!revealing);
        revealing = true;
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
        revealing = true;
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
    function claimReward(uint gameNumber) public returns(bool _claimedReward)  {
        require(lastGameFinished || games.length > gameNumber);
        Game storage game = games[gameNumber-1];
        require(!game.disqualified[msg.sender]);
        require(game.registered[msg.sender]);
        require(game.played[msg.sender]);
        require(game.revealed[msg.sender]);
        require(!game.claimedReward[msg.sender]);
        
        address player1 = msg.sender;
        address player2 = game.pairs[player1];
        
        if (player2 == address(0)) {
            //Odd Player1 , Pay back.
            //Give back extra % of bet amount
            ethTransfer(gameNumber, player1, ((100 + game.oddPlayerBonusPercent) * game.bets[player1].betAmount) / 100);
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if(game.disqualified[player2]) {
            uint256 reward = game.bets[player1].betAmount + ((N3 * game.bets[player2].betAmount) / D);
            ethTransfer(gameNumber, player1, reward);
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( !isEven(game.bets[player1].actualChoice) && !isEven(game.bets[player2].actualChoice) ) { // Split Split
            reward = game.bets[player1].betAmount + ((N1 * game.bets[player2].betAmount) / D);
            ethTransfer(gameNumber, player1, reward);
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if( !isEven(game.bets[player1].actualChoice) && isEven(game.bets[player2].actualChoice) ) { // Split Steal
            reward = ((N1 * game.bets[player1].betAmount) / D);
            ethTransfer(gameNumber, player1, reward);
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if( isEven(game.bets[player1].actualChoice) && !isEven(game.bets[player2].actualChoice) ) { // Steal Split
            reward = game.bets[player1].betAmount + ((N2 * game.bets[player2].betAmount) / D);
            ethTransfer(gameNumber, player1, reward);
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if( isEven(game.bets[player1].actualChoice) && isEven(game.bets[player2].actualChoice) ) { // Steal Steal
            reward = ((N3 * game.bets[player2].betAmount) / D);
            ethTransfer(gameNumber, player1, reward);
            game.claimedReward[msg.sender] = true;
            return true;
        }
    }

    //REWARD WITHDRAW ENDS

}