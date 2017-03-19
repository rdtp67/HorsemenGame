var War = function(initPack){
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
		
		War.list[self.id] = self;
		return self;
}

var war_update = function(data){
    for(var i in data.war_deck){
			var pack = data.war_deck[i];
			var p = War.list[pack.card.id];
			if(p){
				if(pack.cost !== undefined)
					p.cost = pack.card.cost;
                if(pack.event !== undefined)
                    p.event = pack.event;
			}
    }
}

var war_remove = function(data){
    for(var i = 0 ; i < data.war_deck.length; i++){
			delete War.list[data.war_deck[i]];
		}
}