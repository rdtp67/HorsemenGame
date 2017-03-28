
	var Player = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.name = initPack.name;
		self.health = initPack.health;
		self.power_crystal = initPack.power_crystal;
		self.hero_type = initPack.h_type;
		self.hero_name = initPack.hero_name;
		self.hero_attack = initPack.hero_attack;
		self.hero_defense = initPack.hero_defense;
		self.hero_dodge = initPack.hero_dodge;
		
		self.draw = function(w, h){
			ctx.fillStyle = 'white';
			ctx.fillText("Name: " + self.name + "Hero Type" + self.hero_type + " Health: " + self.health + " Power Crystals: " 
			+ self.power_crystal + " ID: " + self.id, w, h);
		}
				
		Player.list[self.id] = self;
		return self;
	}

var player_update = function(data){
    for(var i in data.player){
			var pack = data.player[i];
			var p = Player.list[pack.id];
			if(p){
				if(pack.health !== undefined)
					p.health = pack.health;
				if(pack.power_crystal !== undefined)
					p.power_crystal = pack.power_crystal;
				if(pack.hero_name !== undefined)
					p.hero_name = pack.hero_name;
				if(pack.hero_attack !== undefined)
					p.hero_attack = pack.hero_attack;
				if(pack.hero_defense !== undefined)
					p.hero_defense = pack.hero_defense;
				if(pack.hero_dodge !== undefined)
					p.hero_dodge = pack.hero_defense;
			}
		}
}

var player_remove = function(data){
    for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i]];
		}
}