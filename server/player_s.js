require('./card_s.js');
require('./hero_s.js');
require('./run_s.js');
require('./enums_s');
require('./deck_s.js');
require('./state_s.js');
require('../client/js/player_cards');
require('./helpers_s.js');


var initPack = {};				//Package sent to all clients in room when player connects initially
var removePack = {player:[]};	//Package sent to all clients when player disconnects
const GAMEPLAYERSIZE = 2;		//This needs to be passed in, in the future

Player = function(param){
	var self = {
		health:20,
		power_crystal:0,
	}
	
	self.name = param.username;
	self.id = param.id;
	self.room_id = param.room_id;
	self.state = new State(param.socket, true);
	self.player_cards = new Player_Cards(param.socket, true);
	self.player_hero = null;
	self.hero_type = card_types[Math.floor(Math.random() * card_types.length)]; //Create Randomizer
	self.action = "";

	self.getInitPack = function(){
		return {
			id:self.id,
			room_id:self.room_id,
			health:self.health,
			power_crystal:self.power_crystal,	
			name:self.name,		
			h_type:self.hero_type,
			hero:self.player_hero,
			state:self.state,
			action:self.action,
		};
	}
	
	self.getUpdatePack = function(){
			return {
				id:self.id,
				room_id:self.room_id,
				health:self.health,
				power_crystal:self.power_crystal,
				hero:self.player_hero,
				state:self.state,
				action:self.action,
			};
	}

	self.addCardtoInvent = function(type){
		self.player_cards.addCard(Deck.getTopRunCard(type));
		return;
	}

	self.removeCardfromInvent = function(id){
		self.player_cards.removeCard(id);
		return;
	}

	self.assignHeroCard = function(id){
		self.player_hero = id;
	}

	self.updateStates = function(states_info){
		self.state.updateStates(states_info);
	}

	self.updateAction = function(action_message){
		self.action = null;
		self.action = action_message;
	}

	self.healthModified = function(total){
		self.health += total;
	}

	self.powerCrystalModify = function(total){
		self.power_crystal += total;
	}
	
	Player.list[self.id] = self;
	initPack[self.room_id] = {player:[]};
	initPack[self.room_id].player.push(self.getInitPack());
	
	return self;
}

Player.list = {};

Player.onConnect = function(socket, name, room){
		var player = Player({
		id:socket.id, 
		username:name,
		socket:socket,
		room_id:room,
		name:name});

		//Passes the player package to client that has just joined
		socket.emit('init',{
			selfId:socket.id,
			player:Player.getAllInitPack(room),
		});

		//Passes all heros to player when first connecting
		socket.emit('init_hero', {
			hero_l:Hero.getAllInitPack(),
		});

		//Passes deck information to the player when first connecting
		socket.emit('pushDecks', Deck.getDeckTypes());

		socket.on('cardAction', function(id, type){
			if(!player.player_cards.hasItem(id))
			{
				console.log("Cheater! Player ID: " + player.id);
			}
			else{
				if(player.state.play_cards){
					Deck.getDeckCardAction(id, type, player);
				}
			}
		});
		
		socket.on('addRunCard', function(type){
			if(player.state.choose_card){
				player.addCardtoInvent(type);
				player.updateStates({control:true,play_cards:true, activity:true});
			}
		});

		socket.on('removeCards', function(data){
			player.removeCardfromInvent(data);
		});

		socket.on('addPlayerHeroCard', function(id){
			player.assignHeroCard(id);
			//Assigns game states once all players have joined
			State.assignStatesInitial(Player.list, room, GAMEPLAYERSIZE); //GAMEPLAYERSIZE will need to be changed in the future
		});

		socket.on('attackActivity', function(){
			if(player.state.activity){
				Player.attackOpponent(player.id, room);
				State.changeControl(Player.list, player.id, room);
				player.updateStates();
			}
		});

		socket.on('cowardActivity', function(){
			if(player.state.activity){
				player.power_crystal++;
				player.health-=2;
				player.updateAction("Took the cowards way out... Lost 2 life and gained 1 Power Crystal");
				Player.list[getOpp(room, player.id)].updateAction("");
				State.changeControl(Player.list, player.id, room);
				player.updateStates();
			}
		});

}

Player.getFrameUpdateData = function(){

	var pack = {
		initPack:{
			player:initPack,
		},
		removePack:{
			player:removePack.player,
		},
		updatePack:{
			player:Player.update(),
		}
	};
	
	initPack = {};
	removePack.player = [];

	return pack;
}

//Creates init pack to send to player on connect, only players in room
Player.getAllInitPack = function(data){
	var players = [];
	let  p = null;
	for(var i in Player.list){
		p = Player.list[i].getInitPack();
		if(data == p.room_id)
			players.push(p);
	}
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(){
	var pack = {};
	for(var i in Player.list){
		let room = Player.list[i].room_id;
		let player = Player.list[i];
		let key = checkRoomExist(pack, room);
		if(key == null){
			pack[room] = {player:[]};
			pack[room].player.push(player.getUpdatePack());
		}
		else{
			pack[key].player.push(player.getUpdatePack());
		}
	}
	return pack;
}

Player.attackOpponent = function(cur_id, room){
	
	let opp_id = getOpp(room, cur_id);

	console.log("oppid " + opp_id);

	let opp_hero = Hero.list[Player.list[opp_id].player_hero];
	let atk_hero = Hero.list[Player.list[cur_id].player_hero];
	let opp_mod = Math.floor(Math.random() * 6);
	if((opp_hero.dodge + opp_mod) > atk_hero.attack){
		console.log("Dodge: " + opp_hero.dodge + " Mod: " + opp_mod + " Attack: " + atk_hero.attack);
		Player.list[opp_id].updateAction("Dodge effective! " + opp_hero.dodge + " dodge + " + opp_mod + " modifier = " + (opp_hero.dodge + opp_mod));
		Player.list[cur_id].updateAction("Attack failed. Attack strength " + atk_hero.attack + " was avoided with " + (opp_hero.dodge + opp_mod) + " dodge");

	}
	else if(opp_hero.defense >= atk_hero.attack){
		console.log("Defense: " + opp_hero.defense + " Attack: " + atk_hero.attack);
		Player.list[opp_id].updateAction("Defense effective! " + opp_hero.defense + " defense was enough to stop the attack!");
		Player.list[cur_id].updateAction("Attack failed. Attack strength " + atk_hero.attack + " was defended with " + opp_hero.defense + " defense.");
	}
	else{
		console.log("Dodge: " + opp_hero.dodge + " Mod: " + opp_mod + " Defense: " + opp_hero.defense + " Attack: " + atk_hero.attack);
		let hitLost =  opp_hero.defense - atk_hero.attack;
		Player.list[opp_id].healthModified(hitLost);
		Player.list[opp_id].updateAction("Took " + hitLost + " damage from the attack!");
		Player.list[cur_id].updateAction("Attack effective. Attack strength " + atk_hero.attack + " was stronger than " + opp_hero.defense + " defense.");
	}

}


