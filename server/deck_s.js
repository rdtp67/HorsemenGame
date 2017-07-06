require('./run_s.js');
//var sql = require('./mysql_s.js');
var sql = require('./mysql_s.js');
var util = require('util');//console.log("Run: " + util.inspect(run, {showHidden:false, depth:null}));//console.log("Run: " + util.inspect(run, false, null));
require('./action_s.js');

//read that using function Foo() gets better stack traces than var Foo = function() for constructers, look for into that
Deck = function(room, did, dname, dhtype, ddesc, dcost, devent, dboost, dkeep){ //dhorse){

    var self = {
        id:did,
        name:dname,
        type:dhtype,
        event:devent,
        desc:ddesc,
		cost:dcost,
		boost:dboost,
		keep:dkeep,
		//horse:dhorse, need to put this in use once horseman table complete
    }
	
	if(Deck.list[room] == undefined){
		Deck.list[room] = {deck:[]};
		Deck.deadlist[room] = {deck:[]};
	}	

	Deck.list[room].deck.push(self);

	//return self; //No need to return this?

}

Deck.list = {};
Deck.deadlist = {};

//Purpose: Returns the top card of a certain type to Player which then populates their instance of player_card
//Also removes the card from the current deck and stores it in Deck.deadlist
//Pre: type: type of card, room: current room of player
//Post: one card of requested type
Deck.getTopRunCard = function(type, room){
	var out = {};
	var done = false;
	//This will also have to alert game that there is a boost
	for(var i in Deck.list[room].deck){
		if(Deck.list[room].deck[i].type === type && done == false){
			out = Deck.list[room].deck[i];
			Deck.deadlist[room].deck.push(Deck.list[room].deck[i]);
			Deck.list[room].deck.splice(i,1);
			done = true;
		}
	}

	return out;
}

Deck.getCardByID = function(data){
	var out = {};
	for(var i in Deck.list[data.room].deck){
		if(Deck.list[data.room].deck[i].id == data.id){
			out = Deck.list[data.room].deck[i];
			Deck.deadlist[data.room].deck.push(Deck.list[data.room].deck[i]);
		}
	}
	return out;
}

Deck.getDeckCardAction = function(id,type, player, user_boost){
	var room = player.room_id;
	for(var i in Deck.deadlist[room].deck)
	{
		if(Deck.deadlist[room].deck[i].id == id)
		{
			var run_id = Deck.deadlist[room].deck[i].id;
			Deck.deadlist[room].deck[i].event(Action.cardActionHandler(run_id, player, user_boost));//need to change the hard coded false to bool boost passed in by user upon selecting card
			player.removeCardfromInvent(Deck.deadlist[room].deck[i].id);
			return;
		}
	}
}


Deck.getDeckTypes = function(room){
	var types = [];
	var out = [];
	for(var i = 0; i < Deck.list[room].deck.length; i++){
		types.push(Deck.list[room].deck[i].type);
	}

	out = [...new Set(types)]; //creates new array of unique values

	return(out);
}

Deck.getDeckCards = function(room){
	var out = [];
	for(var i = 0; i < Deck.list[room].deck.length; i++){
		out.push(Deck.list[room].deck[i]);
	}
	console.log(out);
	return(out);
}



//Desc: get the cost of the card
//Pre: id: id of the current card, room: room id for the player
//Post: cost: cost of the card input
Deck.getCardCost = function(id, room){
	var c_cost;
	for(var i = 0; i < Deck.deadlist[room].deck.length; i++){	
		if(Deck.deadlist[room].deck[i].id == id){
			c_cost = Deck.deadlist[room].deck[i].cost;
		}
	}
	return (c_cost);
}


//Purpose: Populates the deck list with the card ids
populateDeck = function(room){
	//console.log("POP DECKS");
	if(Deck.list[room] === undefined){
		sql.getDeck(function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				Deck(room, result[0][i].run_id, result[0][i].run_name, result[0][i].run_type, result[0][i].run_desc, result[0][i].run_cost, function(){}, result[0][i].boost, result[0][i].keep, function(){});
				//console.log(result[0][i].run_name + " " + result[0][i].boost + " " + result[0][i].keep);
			}
		}
	});
}

}





