Player_Cards = function(socket, server){

    var self = {
    items:[],
	socket:socket,
    server:server,
    }

    self.addCard = function(data){
        if(self.socket){
            self.items.push({id:data.id,type:data.type,name:data.name, type:data.type, desc:data.desc, cost:data.cost, boost:data.boost});
            self.refreshRender();
        }
        return;
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
        var addButton = function(data){
            //let item = getRunCardItem(data, i);
            let div = document.createElement('div');
            let text = document.createElement('p');
            let button = document.createElement('button');
            let button2 = document.createElement('button');
            button.onclick = function(){
                getCardFunc(data.id, data.type, false); //need to add in a way to pass in boost bool
            }
            button2.onclick = function(){
                getCardFunc(data.id, data.type, true); //need to add in a way to pass in boost bool
            }
            button.innerText = "Play";
            button2.innerText = "Boost";
            text.innerText = "Name: " + data.name + " Type: " + data.type + " Desc: " + data.desc + " Cost: " + data.cost + " Boost: " + data.boost;
            div.className = "card";
            div.appendChild(text);
            div.appendChild(button);
            if(data.boost == 1){
                div.appendChild(button2);
            }
            invent.appendChild(div);
        }

        for(var i = 0; i<self.items.length; i++){
            addButton(self.items[i]);
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
var getCardFunc = function(id, type, boost){
    socket.emit('cardAction', id, type, boost);
    return;
}