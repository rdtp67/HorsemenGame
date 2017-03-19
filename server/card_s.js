Card = function(cid, chorse, cname){
	var self = {
		id:cid,
		horsemen_type:chorse,
		name:cname,
	}

	self.getInitPackCard = function(){
		return {
			id:self.id,
			horsemen_type:self.horsemen_type,
			name:self.name,			
		};
	}
	
	self.getUpdatePackCard = function(){
		return {
			id:self.id,			
		};
	}

		return self;	
}