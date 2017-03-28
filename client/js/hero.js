var Hero = function(initPack){
		var self = {};
		self.id = initPack.card.id;
		self.horsemen_type = initPack.card.horsemen_type;
		self.title = initPack.card.name;
        self.attack = initPack.attack;
        self.defense = initPack.defense;
        self.dodge = initPack.dodge;
		
		Hero.list[self.id] = self;
		return self;
}

var hero_update = function(data){
    for(var i in data.hero_l){
			var pack = data.hero_l[i];
			var p = Hero.list[pack.card.id];
			if(p){
				if(pack.attack !== undefined)
					p.attack = pack.attack;
                 if(pack.defense !== undefined)
					p.defense = pack.defense;
				if(pack.dodge !== undefined)
					p.dodge = pack.dodge;
			}
		}
}

var hero_remove = function(data){
    for(var i = 0 ; i < data.hero_l.length; i++){
			delete Hero.list[data.hero_l[i]];
		}
}