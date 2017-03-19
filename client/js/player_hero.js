Player_Hero = function(socket){

    var self = {
        id:null,
	    socket:socket,
    }

    self.addCard = function(id){
        self.id = id;
        self.refreshRender();
        return;
    }

    self.getStats = function(){

        let item = Item_Hero.List[self.id];

        return {
            name:item.name,
            attack:item.attack,
            defense:item.defense,
            dodge:item.dodge,
        };
    }
    
    self.refreshRender = function(){
		//server
		if(self.socket){
			self.socket.emit('updateHeroCards', self.id);
			return;
		}
		
        //client only
        var str = "";
            let item = Item_Hero.List[self.id];
            let onclick = "Item_Hero.List['" + item.id + "'].event()";
            str += "<button onclick=\"" + onclick + "\">" + item.name + " </button><br>";      

        document.getElementById('user_hero').innerHTML = str;

    }

    return self;

}

Item_Hero = function(id,name, attack, defense, dodge, event){
    var self = {
        id:id,
        name:name,
        attack:attack,
        defense:defense,
        dodge:dodge,
        event:event,
    }

    Item_Hero.List[self.id] = self;

    return self;
}

Item_Hero.List = {};

Item_Hero("h1", "Hero1", "5", "0", "1", function(){
    Player.list[selfId].health++;
	socket.emit('healthModifier', 1);
});
