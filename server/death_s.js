require('./run_s.js');

var initPack_death = {death_deck:[]};
var removePack_death = {death_deck:[]};

Death = function(did, dname, devent){

    var self = Run(did, 'Death', dname);
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
	
	Death.list[count] = self;	
	initPack_death.death_deck.push(self.getInitPack());
	count++;

	return self;

}

Death.list = {};
var count = 0;

Death.getFrameUpdateDataDeath = function(){

	var pack = {
		initPack_death:{
			death_deck:initPack_death.death_deck,
		},
		removePack_death:{
			death_deck:removePack_death.death_deck,
		},
		updatePack_death:{
			death_deck:Death.update(),
		}
	};
	
	initPack_death.death_deck = [];
	removePack_death.death_deck = [];
	
	return pack;
}

Death.update = function(){
	var pack = [];
	for(var i in Death.list){
		var death = Death.list[i];
		pack.push(death.getUpdatePack());
	}
	return pack;
}

Death.getAllInitPackDeath = function(){
	var death = [];
	for(var i in Death.list){
		death.push(Death.list[i].getInitPack());
	}
	return death;
}

Death.getDeathCardAction = function(id,player){
	for(var i in Death.list)
	{
		if(Death.list[i].id == id)
			//player.health++;
			Death.list[i].event(player);
	}
}

var h7 = Death(count, 'Run1', function(){return;});
var h8 = Death(count, 'Run2', function(){return;});
var h9 = Death(count, 'Run3', function(){return;});
var h10 = Death('d1', 'DeathLoseLife',  function(player){
    player.health--;
});
