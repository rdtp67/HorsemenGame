var Conquest = function(initPack){
		var self = {};
		self.id = initPack.run.card.id;
		self.horsemen_type = initPack.run.card.horsemen_type;
		self.name = initPack.run.card.name;
        self.desc = initPack.run.desc;
        self.cost = initPack.run.cost;
        self.event = initPack.event;
		
		self.draw = function(w, h){
			ctx.fillStyle = 'white';
			ctx.fillText("Name: " + self.name + " ID: " + self.id, w, h);
		}
		
		Conquest.list[self.id] = self;
		return self;
}

var conquest_update = function(data){
    for(var i in data.conquest_deck){
			var pack = data.conquest_deck[i];
			var p = Conquest.list[pack.card.id];
			if(p){
				if(pack.cost !== undefined)
					p.cost = pack.card.cost;
                if(pack.event !== undefined)
                    p.event = pack.event;
			}
    }
}

var conquest_remove = function(data){
    for(var i = 0 ; i < data.conquest_deck.length; i++){
			delete Conquest.list[data.conquest_deck[i]];
		}
}