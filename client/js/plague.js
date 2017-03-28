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

	for(var k = 0; k < data.plague_deck.length; k++){
			var pack = data.plague_deck[k];
			var p = Plague.list[pack.run.card.id];
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
var plague_remove = function(data){
    for(var i = 0 ; i < data.plague_deck.length; i++){
			delete Plague.list[data.plague_deck[i]];
		}
}