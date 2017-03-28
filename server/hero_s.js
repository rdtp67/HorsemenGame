require('./card_s.js');

var initPack_hero = {hero_l:[]};
var removePack_hero = {hero_l:[]};

Hero = function(hid, htype, htitle, hatk, hdef, hdodge){
	var self = Card(hid, htype, htitle);
	self.attack = hatk;
	self.defense = hdef;
	self.dodge = hdodge;

	self.getInitPack = function(){
		return {
			card:self.getInitPackCard(),
			attack:self.attack,
			defense:self.defense,
			dodge:self.dodge,
		};
	}
	
	self.getUpdatePack = function(){
		return {
			card:self.getUpdatePackCard(),
			attack:self.attack,
			defense:self.defense,
			dodge:self.dodge,
		};
	}
	
	Hero.list[hid] = self;
	initPack_hero.hero_l.push(self.getInitPack());
	hero_count++;

	return self;
}

Hero.list = {};
var hero_count = 0;

Hero.getFrameUpdateData = function(){

	var pack = {
		initPack_hero:{
			hero_l:initPack_hero.hero_l,
		},
		removePack_hero:{
			hero_l:removePack_hero.hero_l,
		},
		updatePack_hero:{
			hero_l:Hero.update(),
		}
	};
	
	initPack_hero.hero_l = [];
	removePack_hero.hero_l = [];
	
	return pack;
}

Hero.update = function(){
	var pack = [];
	for(var i in Hero.list){
		var hero = Hero.list[i];
		pack.push(hero.getUpdatePack());
	}
	return pack;
}

Hero.getAllInitPack = function(){
	var hero = [];
	for(var i in Hero.list){
		hero.push(Hero.list[i].getInitPack());
	}
	return hero;
}


var h1 = Hero(hero_count, 'Death', 'DeathHero1', 0, 0, 0);
var h2 = Hero(hero_count, 'War', 'WarHero2', 1, 1, 1);
var h3 = Hero(hero_count, 'Plague', 'PlagueHero3', 2, 2, 2);
var h4 = Hero(hero_count, 'Conquest', 'ConquestHero4', 3, 3, 3);