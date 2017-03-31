require('./run_s.js');

var initPack_deck = {deck_pack:[]};
var removePack_deck = {deck_pack:[]};

Deck = function(did, dname, dhtype, ddesc, dcost, devent){

    var self = {
        id:did,
        name:dname,
        type:dhtype,
        event:devent,
        desc:ddesc,
		cost:dcost,
    }

	self.getInitPack = function(){
		return {
			id:self.id,
            type:self.type,
		};
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
            type:self.type,
		};
	}
	
	Deck.list[count] = self;	
	initPack_deck.deck_pack.push(self.getInitPack());
	count++;

	return self;

}

Deck.list = {};
var count = 0;

Deck.getFrameUpdateDataDeck = function(){

	var pack = {
		initPack_deck:{
			deck_pack:initPack_deck.deck_pack,
		},
		removePack_deck:{
			deck_pack:removePack_deck.deck_pack,
		},
		updatePack_deck:{
			deck_pack:Deck.update(),
		}
	};
	
	initPack_deck.deck_pack = [];
	removePack_deck.deck_pack = [];
	
	return pack;
}

Deck.update = function(){
	var pack = [];
	for(var i in Deck.list){
		var deck = Deck.list[i];
		pack.push(deck.getUpdatePack());
	}
	return pack;
}

Deck.getAllInitPackDeck = function(){
	var deck = [];
	for(var i in Deck.list){
		deck.push(Deck.list[i].getInitPack());
	}
	return deck;
}

Deck.getDeckCardAction = function(id,player){
	for(var i in Deck.list)
	{
		if(Deck.list[i].id == id)
			Deck.list[i].event(player);
	}
}

var h7 = Deck(0, 'Run1', 'Death', 'thing', 3, function(){return;});
var h8 = Deck(1, 'Run2', 'ddd', 'thing', 3,function(){return;});
var h9 = Deck(2, 'Run3', 'Conquest', 'thing', 3,function(){return;});
var h10 = Deck(3, 'DeckLoseLife',  'Shoop', 'sss', 4,function(player){
    player.health--;
});
