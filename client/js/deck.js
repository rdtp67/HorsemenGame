var Deck = function(initPack){
		var self = {};
		self.id = initPack.id;
		self.horsemen_type = initPack.type;

		self.draw = function(w, h){
			ctx.fillStyle = 'white';
			ctx.fillText("Type: " + self.horsemen_type + " ID: " + self.id, w, h);
		}
		
		Deck.list[self.id] = self;
		return self;
}

var deck_update = function(data){

	for(var k = 0; k < data.deck_pack.length; k++){
			var pack = data.deck_pack[k];
			var p = Deck.list[pack.id];
			if(p){
				if(pack.id !== undefined){
					p.id = pack.id;
				}
				if(pack.type !== undefined){
					p.horsemen_type = pack.type;
				}
			}
        }

}

//Needs to be tested
var deck_remove = function(data){
    for(var i = 0 ; i < data.deck_pack.length; i++){
			delete Deck.list[data.deck_pack[i]];
		}
}