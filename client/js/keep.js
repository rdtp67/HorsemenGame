Keep = function(socket, server){

    var self = {
        items:[],
        socket:socket,
        server:server,
    }

    self.addKeepCard = function(data){
        if(self.socket){
            self.items.push({id:data.run_id,type:data.run_type,name:data.run_name, desc:data.run_desc, actionEvent:data.action_keep});
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

    self.refreshRender = function(){
		//server
		if(self.server){
			self.socket.emit('updateKeepCards', self.items);
			return;
		}
		
        //client only
        var invent = document.getElementById("user_keep");
        invent.innerHTML = "";
        var addCard = function(data){
            //let item = getRunCardItem(data, i);
            let div = document.createElement('div');
            let text = document.createElement('p');
            text.innerText = "[Keep] Name: " + data.name + " Type: " + data.type + " Desc: " + data.desc;
            div.className = "card";
            div.appendChild(text);
            invent.appendChild(div);
        }

        for(var i = 0; i<self.items.length; i++){
            addCard(self.items[i]);
        }     
    }

    return self;

}