pragma solidity ^0.4.22;

//TODO : Store Games in a Map instead of array. See if that has any advantages.
//TODO : How to get back money if opponent bets but doesn't reveal
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

contract SplitStealContractV2 is owned, priced {

    //Global Variables
    uint constant STEAL = 0;
    uint constant SPLIT = 1;
    mapping(address=>bool) suspended;
    mapping(address=>uint) totalGamesStarted;
    mapping(address=>uint) totalGamesParticipated;   

    //Game Rules
    uint256 REGISTRATION_COST = 5 * 10**14;// 0.0005 Ether //Editable by Owner
    uint256 MINIMUM_COST_OF_BET = 10**17;// 0.1 Ether //Editable by Owner
    uint256 MAXIMUM_COST_OF_BET = 5 * 10**18;//5 Ether //Editable by Owner

    //Reward Matrix Parameters
    uint256 K = 25; //Editable by Owner

    //Events
    event RegisterationOpened(uint indexed _gameNumber);
    event RegisterationClosed(uint indexed _gameNumber);
    event RevealStart(uint indexed _gameNumber);
    event RevealStop(uint indexed _gameNumber);
    event Transferred(uint indexed _gameNumber,address _to, uint256 _amount);
    event Disqualified(uint indexed _gameNumber, address indexed _player, bytes32 _encryptedChoice, uint _actualChoice, bytes32 _encryptedActualChoice);
    event NewGameRules(uint _oldFees, uint _newFees, uint _oldMinBet, uint _newMinBet, uint _oldMaxBet, uint _newMaxBet);
    event NewRewardMatrix(uint _n1, uint _n2, uint _n3, uint _d);
    event NewRewardPercentage(uint256 _oldK, uint256 _k);
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
        address player1; 
        address player2;
        uint256 registrationCost;
        uint256 k;
        bool registerationOpen;
        bool revealing;
        bool lastGameFinished;
        mapping(address=>address) opponent;
        mapping(address=>bool) registered;
        mapping(address=>Bet) bets;
        mapping(address=>bool) revealed;
        mapping(address=>bool) disqualified;
        mapping(address=>bool) claimedReward;
        mapping(address=>uint256) reward;
    }
    
    Game[] games;

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
    //ADMIN METHODS ENDS

    //VIEW APIs STARTS
    function getOwner() public view returns(address _owner) {
        return owner;
    }

    function getContractBalance() public view returns(uint256 _balance) {
        return address(this).balance;
    }

    function getRewardMatrix() public view returns(uint _k) {
        return (K);
    }

    function getGameRules() public view returns(uint256 _fees, uint256 _minBet, uint256 _maxBet) {
        return (REGISTRATION_COST, MINIMUM_COST_OF_BET, MAXIMUM_COST_OF_BET);
    }

    function getGameState(uint gameNumber) public view returns(bool _registerationOpen, bool _revealing, bool _lastGameFinished) {
        require(games.length >= gameNumber);    
        Game storage game = games[gameNumber - 1];    

        return (game.registerationOpen, game.revealing, game.lastGameFinished);
    }

    function getPlayerState(uint gameNumber) public view returns(bool _suspended, bool _registered, bool _revealed, bool _disqualified, bool _claimedReward, uint256 _betAmount, uint256 _reward) {
        require(games.length >= gameNumber);
        uint index = gameNumber - 1;
        address player = msg.sender;
        uint256 betAmount = games[index].bets[player].betAmount;
        return (suspended[player], games[index].registered[player], games[index].revealed[player], games[index].disqualified[player], games[index].claimedReward[player], betAmount, games[index].reward[player] );
    }

    function getTotalGamesStarted() public view returns(uint _totalGames) {
        return totalGamesStarted[msg.sender];
    }

    function getTotalGamesParticipated() public view returns(uint _totalGames) {
        return totalGamesParticipated[msg.sender];
    }

    function getTotalGames() public view returns(uint _totalGames) {
        return games.length;
    }
    //VIEW APIs ENDS

    //GAME PLAY STARTS
    function startGame(uint256 _betAmount, bytes32 _encryptedChoice) public  payable costs(_betAmount) returns(uint _gameNumber) {
        address player = msg.sender;
        require(!suspended[player]);   
        require(_betAmount >= MINIMUM_COST_OF_BET);
        require(_betAmount <= MAXIMUM_COST_OF_BET);
        Game memory _game = Game(player, address(0), REGISTRATION_COST, K, true, false, false);  
        games.push(_game); 
        Game storage game = games[games.length-1]; 
        game.registered[player] = true;
        game.bets[player] = Bet(_encryptedChoice, _betAmount, 0);                   
        totalGamesStarted[player] = totalGamesStarted[player] + 1;
        emit RegisterationOpened(games.length);
        return games.length;
    }

    function joinGame(uint _gameNumber, uint256 _betAmount, bytes32 _encryptedChoice) public  payable costs(_betAmount) {
        require(games.length >= _gameNumber);
        Game storage game = games[_gameNumber-1];
        address player = msg.sender;
        require(game.player2 == address(0));
        require(!suspended[player]);   
        require(_betAmount >= MINIMUM_COST_OF_BET);
        require(_betAmount <= MAXIMUM_COST_OF_BET);
        require(game.registerationOpen); 
        require(!game.registered[player]);  
        require(game.player2 == address(0)); 
        game.player2 = player;
        game.registered[player] = true;
        game.bets[player] = Bet(_encryptedChoice, _betAmount, 0);    
        game.registerationOpen = false;
        game.revealing = true;    
        game.opponent[game.player1] = game.player2;    
        game.opponent[game.player2] = game.player1;
        totalGamesParticipated[player] = totalGamesParticipated[player] + 1;
        emit RegisterationClosed(_gameNumber);
        emit RevealStart(_gameNumber);
    }

    function reveal(uint _gameNumber, uint256 _choice) public {
        require(games.length >= _gameNumber);
        Game storage game = games[_gameNumber-1];
        require(game.revealing);
        address player = msg.sender;
        require(!suspended[player]);
        require(game.player1 == player || game.player2 == player);
        require(game.registered[player]);
        require(!game.revealed[player]);
        game.revealed[player] = true;
        game.bets[player].actualChoice = _choice;
        bytes32 encryptedChoice = game.bets[player].encryptedChoice;
        bytes32 encryptedActualChoice = keccak256(_choice);
        if( encryptedActualChoice != encryptedChoice) {
            game.disqualified[player] = true;
            emit Disqualified(_gameNumber, player, encryptedChoice, _choice, encryptedActualChoice);
        }
        if(game.revealed[game.player1] && game.revealed[game.player2]) {
            game.revealing = false;
            game.lastGameFinished = true;
            emit RevealStop(_gameNumber);
        }
    }
    //GAME PLAY ENDS


    //REWARD WITHDRAW STARTS
    function ethTransfer(uint gameNumber, address _to, uint256 _amount) private {
        require(!suspended[_to]);
        require(_amount > 0);
        require(_to != address(0));
        if ( _amount > games[gameNumber-1].registrationCost) {
            //Take game Commission
            uint256 amount = _amount - games[gameNumber-1].registrationCost;
            require(address(this).balance >= amount);
            _to.transfer(amount);
            emit Transferred(gameNumber, _to, amount);
        }
    }

    function claimRewardK(uint gameNumber) public returns(bool _claimedReward)  {
        require(games.length >= gameNumber);
        Game storage game = games[gameNumber-1];
        address player = msg.sender;
        require(!suspended[player]);
        //No body joined player's game
        require(!game.claimedReward[player]);
        uint commission = games[gameNumber-1].registrationCost;
        if (game.registerationOpen) {
            game.claimedReward[player] = true;
            game.registerationOpen = false;
            game.lastGameFinished = true;
            game.reward[player] = game.bets[player].betAmount - commission;
            //Bet amount can't be less than commission.
            //Hence no -ve check is required
            ethTransfer(gameNumber, player, game.bets[player].betAmount);
            return true;
        }
        require(game.lastGameFinished);
        require(!game.disqualified[player]);
        require(game.registered[player]);
        require(game.revealed[player]);
        require(!game.claimedReward[player]);
        address opponent = game.opponent[player];
        uint256 reward = 0;
        uint256 gameReward = 0;
        uint256 totalBet = (game.bets[player].betAmount + game.bets[opponent].betAmount);
        if ( game.disqualified[opponent]) {
            gameReward = ((100 + game.k) * game.bets[player].betAmount) / 100;
            reward = gameReward < totalBet ? gameReward : totalBet; //Min (X+Y, (100+K)*X/100)
            ethTransfer(gameNumber, player, reward);
            game.reward[player] = reward - commission;
            //Min (X+Y, (100+K)*X/100) can't be less than commision.
            //Hence no -ve check is required
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( !isEven(game.bets[player].actualChoice) && !isEven(game.bets[opponent].actualChoice) ) { // Split Split
            reward = (game.bets[player].betAmount + game.bets[opponent].betAmount) / 2;
            ethTransfer(gameNumber, player, reward);
            game.reward[player] = reward - commission;
            //(X+Y)/2 can't be less than commision.
            //Hence no -ve check is required
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( !isEven(game.bets[player].actualChoice) && isEven(game.bets[opponent].actualChoice) ) { // Split Steal
            game.reward[player] = 0;
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( isEven(game.bets[player].actualChoice) && !isEven(game.bets[opponent].actualChoice) ) { // Steal Split
            gameReward = (((100 + game.k) * game.bets[player].betAmount)/100);
            reward = gameReward < totalBet ? gameReward : totalBet; 
            ethTransfer(gameNumber, player, reward);
            game.reward[player] = reward - commission;
            //Min (X+Y, (100+K)*X/100) can't be less than commision.
            //Hence no -ve check is required
            game.claimedReward[msg.sender] = true;
            return true;
        }
        if ( isEven(game.bets[player].actualChoice) && isEven(game.bets[opponent].actualChoice) ) { // Steal Steal
            reward = 0;
            if( game.bets[player].betAmount > game.bets[opponent].betAmount) {
                gameReward = ((100 + game.k) * (game.bets[player].betAmount - game.bets[opponent].betAmount)) / 100;
                reward = gameReward < totalBet ? gameReward : totalBet; //Min (X+Y, (100+K)*(X-Y)/100)
            }
            if(reward > 0) {
                ethTransfer(gameNumber, player, reward);
                //Min (X+Y, (100+K)*(X-Y)/100) CAN BE LESS THAN COMMISSION.
                //Hence -ve check is required
                game.reward[player] = reward > commission ? reward - commission : 0;
            }
            
            game.claimedReward[msg.sender] = true;
            return true;
        }
    }
    //REWARD WITHDRAW ENDS

}