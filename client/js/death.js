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

	for(var k = 0; k < data.death_deck.length; k++){
			var pack = data.death_deck[k];
			var p = Death.list[pack.run.card.id];
			if(p){
				if(pack.run.cost !== undefined){
					p.cost = pack.run.cost;
				}
				if(pack.event !== undefined){
					p.event = pack.event;
				}
			}
		}

}

//Needs to be tested
var death_remove = function(data){
    for(var i = 0 ; i < data.death_deck.length; i++){
			delete Death.list[data.death_deck[i]];
		}
}