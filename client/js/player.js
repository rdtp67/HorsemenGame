
	var Player = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.room_id = initPack.room_id;
		self.name = initPack.name;
		self.health = initPack.health;
		self.power_crystal = initPack.power_crystal;
		self.power_crystal_used = initPack.power_crystal_used;
		self.hero_type = initPack.h_type;
		self.player_hero = initPack.hero;
		self.state = new State(initPack.state);
		self.action = initPack.action;
		self.atk_base = initPack.ra.stat_atk_base;
		self.def_base = initPack.ra.stat_def_base;
		self.dodge_base = initPack.ra.stat_dodge_base;
		self.atk_mod_total = initPack.ra.stat_atk_mod_total;
		self.atk_perm_mod = initPack.ra.stat_atk_perm_mod;
		self.def_mod_total = initPack.ra.stat_def_mod_total;
		self.def_perm_mod = initPack.ra.stat_def_perm_mod;
		self.dodge_mod_total = initPack.ra.stat_dodge_mod_total;
		self.dodge_perm_mod = initPack.ra.stat_dodge_perm_mod;
		self.actions = [];		
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
				if(pack.power_crystal_used !== undefined && pack.power_crystal_used !== p.power_crystal_used)
					p.power_crystal_used = pack.power_crystal_used;
				if(pack.hero !== undefined && pack.hero !== p.player_hero)
					p.player_hero = pack.hero;
				if(pack.state !== undefined && pack.state !== p.state)
					p.state.updateState(pack.state);
				if(pack.action !== undefined && pack.action !== p.action){
					p.action = pack.action;
				}
				if(pack.ra.stat_atk_base !== undefined && pack.ra.stat_atk_base !== p.atk_base){
					p.atk_base = pack.ra.stat_atk_base;
				}
				if(pack.ra.stat_def_base !== undefined && pack.ra.stat_def_base !== p.def_base){
					p.def_base = pack.ra.stat_def_base;
				}
				if(pack.ra.stat_dodge_base !== undefined && pack.ra.stat_dodge_base !== p.dodge_base){
					p.dodge_base = pack.ra.stat_dodge_base;
				}
				if(pack.ra.stat_atk_mod_total !== undefined && pack.ra.stat_atk_mod_total !== p.atk_mod_total){
					p.atk_mod_total = pack.ra.stat_atk_mod_total;
				}
				if(pack.ra.stat_atk_perm_mod !== undefined && pack.ra.stat_atk_perm_mod !== p.atk_perm_mod){
					p.atk_perm_mod = pack.ra.stat_atk_perm_mod;
				}

				if(pack.ra.stat_def_mod_total !== undefined && pack.ra.stat_def_mod_total !== p.def_mod_total){
					p.def_mod_total = pack.ra.stat_def_mod_total;
				}
				if(pack.ra.stat_def_perm_mod !== undefined && pack.ra.stat_def_perm_mod !== p.def_perm_mod){
					p.def_perm_mod = pack.ra.stat_def_perm_mod;
				}

				if(pack.ra.stat_dodge_mod_total !== undefined && pack.ra.stat_dodge_mod_total !== p.dodge_mod_total){
					p.dodge_mod_total = pack.ra.stat_dodge_mod_total;
				}
				if(pack.ra.stat_dodge_perm_mod !== undefined && pack.ra.stat_dodge_perm_mod !== p.dodge_perm_mod){
					p.dodge_perm_mod = pack.ra.stat_dodge_perm_mod;
				}
				if(p.actions != undefined && pack.ha != undefined){
					p.actions = pack.ha;
				}
			}
		}
}

var player_remove = function(data){
    for(var i = 0 ; i < data.player.length; i++){
			delete Player.list[data.player[i]];
		}
}


//Helpers
getHeroActionAction = function(id){
    socket.emit('heroActionAction', id);
    return;
}