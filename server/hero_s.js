require('./card_s.js');
require('./run_s.js');
var sql = require('./mysql_s.js');
var initPack_hero = {hero_l:[]};

Hero = function(hid, htype, htitle, hatk, hdef, hdodge){
	var self = Card(hid, htype, htitle);
	self.attack = hatk;
	self.defense = hdef;
	self.dodge = hdodge;
	self.desc = hdesc;
	self.subType = hstype;

	self.getInitPack = function(){
		return {
			card:self.getInitPackCard(),
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

Hero.getAllInitPack = function(){
	var hero = [];
	for(var i in Hero.list){
		hero.push(Hero.list[i].getInitPack());
	}
	return hero;
}

Hero.getBaseStats = function(id){
	let hero = Hero.list[id];
	return({atk:hero.attack, def:hero.defense, dodge:hero.dodge});
}

populateHero = function(){
	sql.getHeroList(function(err, result){
		if(!err){
			for(var i in result){
				console.log(result[i].hero_id);
			}
		}
	});
}
