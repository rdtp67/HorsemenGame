require('./run_s.js');

Deck = function(did, dname, dhtype, ddesc, dcost, devent){

    var self = {
        id:did,
        name:dname,
        type:dhtype,
        event:devent,
        desc:ddesc,
		cost:dcost,
    }
	
	Deck.list[count] = self;	
	count++;

	return self;

}

Deck.list = {};
var count = 0;

Deck.getDeckCardAction = function(id,player){
	for(var i in Deck.list)
	{
		if(Deck.list[i].id == id)
			Deck.list[i].event(player);
	}
}

var h7 = Deck(0, 'Run1', 'Death', 'thing', 3, function(){return;});
var h8 = Deck(1, 'Run2', 'War', 'thing', 3,function(){return;});
var h9 = Deck(2, 'Run3', 'Conquest', 'thing', 3,function(){return;});
var h10 = Deck(3, 'DeckLoseLife',  'Plague', 'sss', 4,function(player){
    player.health--;
});
