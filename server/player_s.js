require('./card_s.js');
require('./hero_s.js');
require('./run_s.js');
require('./enums_s');
require('./deck_s.js');


var initPack = {};
var removePack = {player:[]};

Player = function(param){
	var self = {
		health:20,
		power_crystal:1,
	}
	
	self.name = param.username;
	self.id = param.id;
	self.room_id = param.room_id;
	self.player_cards = new Player_Cards(param.socket, true);
	self.player_hero = null;//new Player_Hero(param.socket, true);
	self.hero_type = card_types[Math.floor(Math.random() * card_types.length)]; //Create Randomizer
	self.control = false;

	self.getInitPack = function(){
		return {
			id:self.id,
			room_id:self.room_id,
			health:self.health,
			power_crystal:self.power_crystal,	
			name:self.name,		
			h_type:self.hero_type,
			hero:self.player_hero,
		};
	}
	
	self.getUpdatePack = function(){
			return {
				id:self.id,
				room_id:self.room_id,
				health:self.health,
				power_crystal:self.power_crystal,
				hero:self.player_hero,
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
		//console.log(self.player_hero);
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
		room_id:room});
		player.name = name;

		console.log(socket.id);

		socket.emit('init',{
			selfId:socket.id,
			player:Player.getAllInitPack(room),
		});

		socket.emit('init_hero', {
			hero_l:Hero.getAllInitPack(),
		});

		socket.emit('pushDecks', Deck.getDeckTypes());

		socket.on('cardAction', function(id, type){
			if(!player.player_cards.hasItem(id))
			{
				console.log("Cheater! Player ID: " + player.id);
			}
			else{
				console.log("card " + id + " " + type + " " + player.power_crystal);
				Deck.getDeckCardAction(id, type, player);
			}
		});
		
		socket.on('addRunCard', function(type){
			player.addCardtoInvent(type);
		});

		socket.on('removeCards', function(data){
			player.removeCardfromInvent(data);
		});

		socket.on('addPlayerHeroCard', function(id){
			player.assignHeroCard(id);
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
			console.log("null");
			pack[room] = {player:[]};
			pack[room].player.push(player.getUpdatePack());
		}
		else{
			console.log("key" + key);
			pack[key].player.push(player.getUpdatePack());
		}
	}
	return pack;
}

var checkRoomExist = function(pack, room){
	var isRoom = null;
	Object.keys(pack).forEach(key => {
		if(key == room){
			isRoom = key;
		}
	});

	return isRoom;
}


