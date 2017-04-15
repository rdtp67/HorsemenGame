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
	
	Deck.list[self.id] = self;	
	count++;

	return self;

}

Deck.list = {};
var count = 0;

//This will need to pop the top card off, and store it?
Deck.getTopRunCard = function(type){
	var out = {};
	Object.keys(Deck.list).forEach(key =>{
		if(Deck.list[key].type === type){
			out = Deck.list[key];
		}
	});

	return out;
}

Deck.getDeckCardAction = function(id,type,player){
	for(var i in Deck.list)
	{
		if(Deck.list[i].id == id)
		{
			Deck.list[i].event(player);
			player.removeCardfromInvent(Deck.list[i].id);
			return;
		}
	}
}


Deck.getDeckTypes = function(){
	var types = [];
	var out = [];

	Object.keys(Deck.list).forEach(key =>{ //Iterates through the key values of object list
		types.push(Deck.list[key].type);
	})

	out = [...new Set(types)]; //creates new array of unique values

	return(out);
}

var h7 = Deck('d1', 'Remove Health', 'Death', 'thing', 3, function(player){
	player.health--;});
var h8 = Deck('w1', 'Remove PC', 'War', 'thing', 3,function(player){
	player.power_crystal--;});
var h9 = Deck('c1', 'Add PC', 'Conquest', 'thing', 3,function(player){
	player.power_crystal++;});
var h10 = Deck('p1', 'Add Health',  'Plague', 'sss', 4,function(player){
    player.health++;
});
var h9 = Deck('c2', 'PC + 3', 'Conquest', 'dddd', 7,function(player){
	player.power_crystal+=3;});

