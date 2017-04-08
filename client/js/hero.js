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
