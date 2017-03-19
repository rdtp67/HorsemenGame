var Death = function(initPack){
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
		
		Death.list[self.id] = self;
		return self;
}

var death_update = function(data){
    for(var i in data.death_deck){
			var pack = data.death_deck[i];
			var p = Death.list[pack.card.id];
			if(p){
				if(pack.cost !== undefined)
					p.cost = pack.card.cost;
                if(pack.event !== undefined)
                    p.event = pack.event;
			}
    }
}

var death_remove = function(data){
    for(var i = 0 ; i < data.death_deck.length; i++){
			delete Death.list[data.death_deck[i]];
		}
}