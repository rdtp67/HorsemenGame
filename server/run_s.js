require('./card_s.js');

Run = function(rid, rtype, rname){

	var self = Card(rid, rtype, rname);
	self.desc = '';
	self.cost = 0;

	self.getInitPackRun = function(){
		return {
			card:self.getInitPackCard(),
			desc:self.desc,
			cost:self.cost,
		};
	}
	
	self.getUpdatePackRun = function(){
		return {
			card:self.getUpdatePackCard(),
			cost:self.cost,
		};
	}

	return self;
}

