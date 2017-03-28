Player_Hero = function(socket, server){

    var self = {
        id:null,
	    socket:socket,
        server:server,
    }

    self.addCard = function(id){
        self.id = id;
        self.refreshRender();
        return;
    }

    self.getStats = function(){
        if(Hero.list[self.id]){
            let item = Hero.list[self.id];

            return {
                name:item.name,
                attack:item.attack,
                defense:item.defense,
                dodge:item.dodge,
            };   
        }
    }
    
    self.refreshRender = function(){
		//server
		if(self.server){
			self.socket.emit('updateHeroCards', self.id);
			return;
		}
		
        //client only
        /*var str = "";
            let item = Hero.list[self.id];
            let onclick = "Hero.List['" + item.id + "'].event()";
            str += "<button onclick=\"" + onclick + "\">" + item.name + " </button><br>";   

        document.getElementById('user_hero').innerHTML = str;*/

        /*var invent = document.getElementById("user_hero");
        invent.innerHTML = "";
            let item = Hero.list[self.id];
            let button = document.createElement('button');
            button.onclick = function(){
                //getCardFunc(item.id, item.horsemen_type);
            }
            button.innerText = item.name;
            invent.appendChild(button);*/
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
