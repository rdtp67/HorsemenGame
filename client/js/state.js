State = function({control = false, choose_card = false, play_cards = false, activity = false} = {}){
    var self = {
        control:control,
        choose_card:choose_card,
        play_cards:play_cards,
        activity:activity,
    }

    self.updateState = function({control = false, choose_card = false, play_cards = false, activity = false} = {}){
             self.control = control;
            self.choose_card = choose_card;
            self.play_cards = play_cards;
            self.activity = activity;
    }

    return self;

}

var state_update = function(data){
    for(var i in data.state){
			var pack = data.state[i];
			var p = State.list[pack.id];
			if(p){
				if(pack.control !== undefined && pack.control !== p.control)
					p.control = pack.control;
				if(pack.choose_card !== undefined && pack.choose_card !== p.choose_card)
					p.choose_card = pack.choose_card;
				if(pack.play_cards !== undefined && pack.play_cards !== p.play_cards)
					p.play_cards = pack.play_cardshero;
                if(pack.activity !== undefined && pack.activity !== p.activity)
					p.activity = pack.activity;
			}
		}
}
