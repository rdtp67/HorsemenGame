Player_Cards = function(socket, server){

    var self = {
    items:[],
	socket:socket,
    server:server,
    }

    self.addCard = function(cid, ctype){
        if(self.socket){
            self.items.push({id:cid,type:ctype});
            self.refreshRender();
            return;
        }
    }
    self.removeCard = function(id){
        for(var i = 0; i<self.items.length; i++){
            if(self.items[i].id == id){
                self.items.splice(i,1);
                self.refreshRender();
                return;
            }    
        }
        self.refreshRender();
        return;
    }
    self.hasItem = function(id){
        for(var i = 0; i<self.items.length; i++){
            if(self.items[i].id === id)
                return true;            
        }
        return false;
    }
    self.refreshRender = function(){
		//server
		if(self.server){
			self.socket.emit('updateCards', self.items);
			return;
		}
		
        //client only
        var invent = document.getElementById("user_cards");
        invent.innerHTML = "";
        var addButton = function(data, i){
            let item = getRunCardItem(data, i);
            let button = document.createElement('button');
            button.onclick = function(){
                getCardFunc(item.id, item.horsemen_type);
            }
            button.innerText = item.name;
            invent.appendChild(button);
        }

        for(var i = 0; i<self.items.length; i++){
            addButton(self, i);
        }     
    }


    return self;

}

Item = function(id,name,event){
    var self = {
        id:id,
        name:name,
        event:event,
    }

    Item.List[self.id] = self;

    return self;
}

Item.List = {};

Item("r1", "LoseLife", function(){
    Player.list[selfId].health++;
    socket.emit('healthModifier', 1);
    socket.emit('removeCards', 'r1');
});


//Helpers
var getCardFunc = function(id, type){
    socket.emit('cardAction', id, type);
    return;
}

var getRunCardItem = function(self, i){
    var item;
            if(self.items[i].type == 'Death')
            {
                item = Death.list[self.items[i].id];
            }
            else if(self.items[i].type == 'Plague')
            {
                item = Plague.list[self.items[i].id];
            }
            else if(self.items[i].type == 'War')
            {
                item = War.list[self.items[i].id];
            }
            else if(self.items[i].type == 'Conquest')
            {
                item = Conquest.list[self.items[i].id];
            }
            else 
            {

            }
            return item;
}