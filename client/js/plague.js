var Plague = function(initPack){
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
		
		Plague.list[self.id] = self;
		return self;
}

var plague_update = function(data){
    for(var i in data.plague_deck){
			var pack = data.plague_deck[i];
			var p = Plague.list[pack.card.id];
			if(p){
				if(pack.cost !== undefined)
					p.cost = pack.card.cost;
                if(pack.event !== undefined)
                    p.event = pack.event;
			}
    }
}

var plague_remove = function(data){
    for(var i = 0 ; i < data.plague_deck.length; i++){
			delete Plague.list[data.plague_deck[i]];
		}
}