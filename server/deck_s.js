require('./run_s.js');
//var sql = require('./mysql_s.js');
var sql = require('./mysql_s.js');
var util = require('util');//console.log("Run: " + util.inspect(run, {showHidden:false, depth:null}));//console.log("Run: " + util.inspect(run, false, null));

//read that using function Foo() gets better stack traces than var Foo = function() for constructers, look for into that
Deck = function(room, did, dname, dhtype, ddesc, dcost, devent){

    var self = {
        id:did,
        name:dname,
        type:dhtype,
        event:devent,
        desc:ddesc,
		cost:dcost,
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

Deck.getDeckCardAction = function(id,type, player){
	var room = player.room_id;
	for(var i in Deck.deadlist[room].deck)
	{
		if(Deck.deadlist[room].deck[i].id == id)
		{
			var run_id = Deck.deadlist[room].deck[i].id;
			Deck.deadlist[room].deck[i].event(Deck.getEventForCard(run_id, player, false));//need to change the hard coded false to bool boost passed in by user upon selecting card
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

//Purpose: Get the card event for the card action requested
//pulls the information from the database at this point for the one card
//Pre: id: run_id for the run card needing event, player: player with the card
Deck.getEventForCard = function(id, player, boost){
	sql.getCardAction(id, function(err, result){
		var run = {};//Will contain all run card instance for the id, index is on boost to tell the difference between standard and boost
		if(!err){
			for(var i in result){
				let card = result[i];			
				run[card.run_boost] = card;
			}

			let c_instance_type = (boost === true) ? 1 : 0; //run_boost 1: boosted, 0: not boosted (standard run card)
			var c_instance = run[c_instance_type];

			console.log("Run: " + util.inspect(c_instance, false, null));

			if(c_instance.stat_id !== null){
				player.statUpdate({atk_inc:c_instance.stat_atk_increase, 
									atk_len:c_instance.stat_atk_turn_len, 
									atk_perm:c_instance.stat_atk_perm,
									def_inc:c_instance.stat_def_increase, 
									def_len:c_instance.stat_def_turn_len, 
									def_perm:c_instance.stat_def_perm,
									dodge_inc:c_instance.stat_dodge_increase, 
									dodge_len:c_instance.stat_dodge_turn_len, 
									dodge_perm:c_instance.stat_dodge_perm,});
			}

			if(c_instance.power_crystal_id !== null){
				player.powerCrystalModifier(c_instance.power_crystal_add);
			}

			if(c_instance.draw_id !== null){
				player.drawCardUpdate(c_instance.draw_logic);
			}

			if(c_instance.health_id !== null){
				player.healthUpdate({h_add:c_instance.health_add,
									 h_perm:c_instance.health_above_max,});
			}


		}
	});	
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
	if(Deck.list[room] === undefined){
		sql.getDeck(function(err, result){
		if(!err){
			for(var i in result){
				Deck(room, result[i].run_id, result[i].run_name, result[i].run_type, result[i].run_desc, result[i].run_cost, function(){});
				//console.log(room + " " + result[i].run_id + " " + result[i].run_name); //Populated deck output
			}
		}
	});
}

}





