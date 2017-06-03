Hero_Action = function(socket, server){

    var self = {
        actions:[],
        socket:socket,
        server:server,
    }

    self.createHeroActionButtons = function(){
        //server
		if(self.server){
			self.socket.emit('createHeroAction', self.actions);
            console.log(self.actions.length);
			return;
		}
        //client only
        var invent = document.getElementById("hero_actions");
        invent.innerHTML = "";
        var addButton = function(data){
            let button = document.createElement('button');
            button.onclick = function(){
                getHeroAction(data.id);
            }
            button.innerText = "Name: " + data.id + " Desc: " + data.desc + " Cost: " + data.cost;
            invent.appendChild(button);
        }
        console.log(self.actions.length);
        for(var i = 0; i<self.actions.length; i++){
            addButton(self.actions[i]);
        }   

    }

    return self;
    
}

//Helpers
var getHeroAction = function(id){
    socket.emit('heroActionAction', id);
    return;
}