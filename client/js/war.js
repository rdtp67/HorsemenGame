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

	for(var k = 0; k < data.war_deck.length; k++){
			var pack = data.war_deck[k];
			var p = War.list[pack.run.card.id];
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
var war_remove = function(data){
    for(var i = 0 ; i < data.war_deck.length; i++){
			delete War.list[data.war_deck[i]];
		}
}