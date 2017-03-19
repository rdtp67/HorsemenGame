require('./run_s.js');

var initPack_conquest = {conquest_deck:[]};
var removePack_conquest = {conquest_deck:[]};

Conquest = function(did, dname, devent){

    var self = Run(did, 'Conquest', dname);
	self.event = devent;

	self.getInitPack = function(){
		return {
			run:self.getInitPackRun(),
			event:self.event,
		};
	}
	
	self.getUpdatePack = function(){
		return {
			run:self.getUpdatePackRun(),
			event:self.event,
		};
	}
	
	Conquest.list[count] = self;	
	initPack_conquest.conquest_deck.push(self.getInitPack());
	count++;

	return self;

}

Conquest.list = {};
var count = 0;

Conquest.getFrameUpdateDataConquest = function(){

	var pack = {
		initPack_conquest:{
			conquest_deck:initPack_conquest.conquest_deck,
		},
		removePack_conquest:{
			conquest_deck:removePack_conquest.conquest_deck,
		},
		updatePack_conquest:{
			conquest_deck:Conquest.update(),
		}
	};
	
	initPack_conquest.conquest_deck = [];
	removePack_conquest.conquest_deck = [];
	
	return pack;
}

Conquest.update = function(){
	var pack = [];
	for(var i in Conquest.list){
		var conquest = Conquest.list[i];
		pack.push(conquest.getUpdatePack());
	}
	return pack;
}

Conquest.getAllInitPackConquest = function(){
	var conquest = [];
	for(var i in Conquest.list){
		conquest.push(Conquest.list[i].getInitPack());
	}
	return conquest;
}

Conquest.getConquestCardAction = function(id,player){
	for(var i in Conquest.list)
	{
		if(Conquest.list[i].id == id)
			//player.health++;
			Conquest.list[i].event(player);
	}
}

var h7 = Conquest(count, 'Run1', function(){return;});
var h8 = Conquest(count, 'Run2', function(){return;});
var h9 = Conquest(count, 'Run3', function(){return;});
var h10 = Conquest('c1', 'ConquestAddLife',  function(player){
    player.health++;
});
