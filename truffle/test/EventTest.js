
//...
const filter = instance.Registered();
//You can also listen to a specific value triggering the event.
/*
const filter = instance.Registered({
    _player: "VALUE_THAT_YOU_WANT_TO_MATCH"
},{
    fromBlock: 0, 
    toBlock: 'latest'
});
*/

filter.watch((err, res) => {
    //Below we print the value triggered but we must convert it first.
    console.log(web3.toUtf8(res.args._player));
    //...
}
//Keep in mind you also need to change your Solidity code so that the _player variable contains the indexed keyword if you want to also be able to listen to a specific variable being emitted with the event.