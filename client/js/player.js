
	var Player = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.room_id = initPack.room_id;
		self.name = initPack.name;
		self.health = initPack.health;
		self.power_crystal = initPack.power_crystal;
		self.hero_type = initPack.h_type;
		self.player_hero = initPack.hero;
		self.state = new State(initPack.state);
		self.action = initPack.action;
					
		Player.list[self.id] = self;
		return self;
	}

var player_update = function(data){
    for(var i in data.player){
			var pack = data.player[i];
			var p = Player.list[pack.id];
			if(p){
				if(pack.health !== undefined && pack.health !== p.health)
					p.health = pack.health;
				if(pack.power_crystal !== undefined && pack.power_crystal !== p.power_crystal)
					p.power_crystal = pack.power_crystal;
				if(pack.hero !== undefined && pack.hero !== p.player_hero)
					p.player_hero = pack.hero;
				if(pack.state !== undefined && pack.state !== p.state)
					p.state.updateState(pack.state);
				if(pack.action !== undefined && pack.action !== p.action){
					p.action = pack.action;
				}
			}
		}
}

var player_remove = function(data){
    for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i]];
		}
}