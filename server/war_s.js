
/* For reference only ~ can be deleted */

require('./run_s.js');

var initPack_war = {war_deck:[]};
var removePack_war = {war_deck:[]};

War = function(did, dname, devent){

    var self = Run(did, 'War', dname);
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
	
	War.list[count] = self;	
	initPack_war.war_deck.push(self.getInitPack());
	count++;

	return self;

}

War.list = {};
var count = 0;

War.getFrameUpdateDataWar = function(){

	var pack = {
		initPack_war:{
			war_deck:initPack_war.war_deck,
		},
		removePack_war:{
			war_deck:removePack_war.war_deck,
		},
		updatePack_war:{
			war_deck:War.update(),
		}
	};
	
	initPack_war.war_deck = [];
	removePack_war.war_deck = [];
	
	return pack;
}

War.update = function(){
	var pack = [];
	for(var i in War.list){
		var war = War.list[i];
		pack.push(war.getUpdatePack());
	}
	return pack;
}

War.getAllInitPackWar = function(){
	var war = [];
	for(var i in War.list){
		war.push(War.list[i].getInitPack());
	}
	return war;
}

War.getWarCardAction = function(id,player){
	for(var i in War.list)
	{
		if(War.list[i].id == id)
			//player.health++;
			War.list[i].event(player);
	}
}

var h7 = War(count, 'Run1', function(){return;});
var h8 = War(count, 'Run2', function(){return;});
var h9 = War(count, 'Run3', function(){return;});
var h10 = War(count, 'WarLosePC',  function(player){
    player.power_crystal--;
});
