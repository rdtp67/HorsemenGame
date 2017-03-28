require('./card_s.js');
require('./hero_s.js');
require('./run_s.js');
require('./death_s.js');
require('./plague_s.js');
require('./war_s.js');
require('./conquest_s.js');
require('./enums_s');


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

	self.addCardtoInvent = function(id, type){
		self.player_cards.addCard(id, type);
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
			player.addCardtoInvent(3, type);
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

		socket.emit('init_run', {
			death_deck:Death.getAllInitPackDeath(),
			plague_deck:Plague.getAllInitPackPlague(),
			war_deck:War.getAllInitPackWar(),
			conquest_deck:Conquest.getAllInitPackConquest(),
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

var getRunCardAction = function(id, type, player){
	if(type === 'Death')
	{
		for(var i in Death.list)
		{
			if(Death.list[i].id == id)
			{
				Death.getDeathCardAction(id,player);
				player.removeCardfromInvent(Death.list[i].id);
			}
		}
	}
	else if(type === 'Plague')
	{
		for(var i in Plague.list)
		{
			if(Plague.list[i].id == id)
			{
				Plague.getPlagueCardAction(id,player);
				player.removeCardfromInvent(Plague.list[i].id);
			}
		}
	}

	if(type === 'War')
	{
		for(var i in War.list)
		{
			if(War.list[i].id == id)
			{
				War.getWarCardAction(id,player);
				player.removeCardfromInvent(War.list[i].id);
			}
		}
	}

	if(type === 'Conquest')
	{
		for(var i in Conquest.list)
		{
			if(Conquest.list[i].id == id)
			{
				Conquest.getConquestCardAction(id,player);
				player.removeCardfromInvent(Conquest.list[i].id);
			}
		}
	}
}

