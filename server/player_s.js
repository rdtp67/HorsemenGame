require('./card_s.js');
require('./hero_s.js');
require('./run_s.js');
require('./enums_s');
require('./deck_s.js');


var initPack = {player:[]};
var removePack = {player:[]};

Player = function(param){
	var self = {
		health:20,
		power_crystal:1,
	}
	
	self.name = param.username;
	self.id = param.id;
	self.player_cards = new Player_Cards(param.socket, true);
	self.player_hero = new Player_Hero(param.socket, true);
	self.hero_type = card_types[Math.floor(Math.random() * card_types.length)]; //Create Randomizer

	self.getInitPack = function(){
		return {
			id:self.id,
			health:self.health,
			power_crystal:self.power_crystal,	
			name:self.name,		
			h_type:self.hero_type,
		};
	}
	
	self.getUpdatePack = function(){
		let stat = self.player_hero.getStats();
		if(stat !== undefined){
			return {
			id:self.id,
			health:self.health,
			power_crystal:self.power_crystal,
			hero_name:stat.name,
			hero_attack:stat.attack,
			hero_defense:stat.defense,
			hero_dodge:stat.dodge,
			};
		}
		else{
			return{
				id:self.id,
				health:self.health,
				power_crystal:self.power_crystal,
			};
		}
	}

	self.addCardtoInvent = function(type){
		self.player_cards.addCard(Deck.list[3]);
		return;
	}

	self.removeCardfromInvent = function(id){
		self.player_cards.removeCard(id);
		return;
	}

	self.assignHeroCard = function(id){
		self.player_hero.addCard(id);
	}
	
	Player.list[self.id] = self;
	
	initPack.player.push(self.getInitPack());
	
	return self;
}

Player.list = {};

Player.onConnect = function(socket, name){
		var player = Player({
		id:socket.id, 
		username:name,
		socket:socket});
		player.name = name;

		socket.on('cardAction', function(id, type){
			if(!player.player_cards.hasItem(id))
			{
				console.log("Cheater! Player ID: " + player.id);
			}
			else{
				getRunCardAction(id, type, player);
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
		
		socket.emit('init',{
			selfId:socket.id,
			player:Player.getAllInitPack(),
		});

		socket.emit('init_hero', {
			hero_l:Hero.getAllInitPack(),
		});

		socket.emit('init_decks', {
			deck_pack:Deck.getAllInitPackDeck(),
		});

}

Player.getFrameUpdateData = function(){

	var pack = {
		initPack:{
			player:initPack.player,
		},
		removePack:{
			player:removePack.player,
		},
		updatePack:{
			player:Player.update(),
		}
	};
	
	initPack.player = [];
	removePack.player = [];

	return pack;
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list){
		players.push(Player.list[i].getInitPack());
	}
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		pack.push(player.getUpdatePack());
	}
	return pack;
}


