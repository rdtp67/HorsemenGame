require('./run_s.js');

var initPack_plague = {plague_deck:[]};
var removePack_plague = {plague_deck:[]};

Plague = function(did, dname, devent){

    var self = Run(did, 'Plague', dname);
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
	
	Plague.list[count] = self;	
	initPack_plague.plague_deck.push(self.getInitPack());
	count++;

	return self;

}

Plague.list = {};
var count = 0;

Plague.getFrameUpdateDataPlague = function(){

	var pack = {
		initPack_plague:{
			plague_deck:initPack_plague.plague_deck,
		},
		removePack_plague:{
			plague_deck:removePack_plague.plague_deck,
		},
		updatePack_plague:{
			plague_deck:Plague.update(),
		}
	};
	
	initPack_plague.plague_deck = [];
	removePack_plague.plague_deck = [];
	
	return pack;
}

Plague.update = function(){
	var pack = [];
	for(var i in Plague.list){
		var plague = Plague.list[i];
		pack.push(plague.getUpdatePack());
	}
	return pack;
}

Plague.getAllInitPackPlague = function(){
	var plague = [];
	for(var i in Plague.list){
		plague.push(Plague.list[i].getInitPack());
	}
	return plague;
}

Plague.getPlagueCardAction = function(id,player){
	for(var i in Plague.list)
	{
		if(Plague.list[i].id == id)
			//player.health++;
			Plague.list[i].event(player);
	}
}

var h7 = Plague(count, 'Run1', function(){return;});
var h8 = Plague(count, 'Run2', function(){return;});
var h9 = Plague(count, 'Run3', function(){return;});
var h10 = Plague(count, 'PlagueAddPC',  function(player){
    player.power_crystal++;
});
