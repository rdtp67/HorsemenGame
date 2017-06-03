var express = require('express');
var app = express();
var server = require('http').Server(app);
var mysql = require('mysql');



require('./server/player_s');
require('./server/hero_s');
require('./client/js/player_cards');
require('./server/state_s.js');
require('./server/deck_s');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
	
});

app.get('/game', function(req, res){
	res.sendFile(__dirname + '/client/game.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(2000);
console.log("Server Started");

var SOCKET_LIST = {};
var room_num = 1;

//Debug = false when live, curently allows for logging to console from front end
var DEBUG = true;

//Populates Hero List for all users, users currently using the same List of Hero player_cards
populateHero();

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){

	//Vars
	var cur_room = null; 	//Holds the room for the socket
	var size = 0; 			//Used to log the number of players connected when a player signs in

	//This will need to be changed out for something inteligent that looks through all rooms with players
	if(io.nsps['/'].adapter.rooms["room-"+room_num] && io.nsps['/'].adapter.rooms["room-"+room_num].length > 1){
		room_num++;
	}

	populateDeck(room_num);
	

  	socket.join("room-"+room_num);
	console.log("Room: " + room_num);
	cur_room = room_num;

	//Socket: emits message to client only, sends room number
	socket.emit('connectToRoom', "You are in room no. "+room_num);

	//Assigns socket a random value and room number
	// ~~ Random value will have to change to remove chance of overlaping socketing ids ~~
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = {socket:socket, room_id:cur_room};

	//Desc: Socket listens for player to finish the sign in process, then creates a new player
	//Pre: client username
	//Note: will need to create a log in process here, check out the DG project since you've already done salt/hashing there
	 socket.on('signIn',function(data){
		 if(Player.list){
			Player.onConnect(socket, data.username, cur_room);
            socket.emit('signInResponse',{success:true, room_id:room_num});
			Object.keys(Player.list).forEach(key =>{
				size++;
		 	});
			console.log("Players: " + size);
		 }
    });

	//Desc: Socket listens for client signing up
	//Pre: client username
	//Note: All logic still to be created
    socket.on('signUp',function(data){
                socket.emit('signUpResponse',{success:false});      
    });

	//Desc: Socket listens for client to disconect, does all clean up associated (leave room, remove from player list, remove socket)			
	socket.on('disconnect', function(){
		socket.leave("room-"+room_num);
		Player.onDisconnect(socket);
		delete SOCKET_LIST[socket.id];	
		console.log('User Disconnected');
	});

	//Desc: Socket listens for client to submit a message, message is sent out to all non client users in room
	//Pre: String message & room number
	//Post: broadcasts messsage to room
	socket.on('sendMsgToServer',function(data){
        var playerName = Player.list[socket.id].name;
		var socket_c = SOCKET_LIST[socket.id].socket;
		socket_c.broadcast.to("room-" + data.room_id).emit('addToChat',playerName + ': ' + data.value);
    });
	
	//Desc: Socket listens to debug values in client chat, allows for console logging
	//Pre: messgage
	socket.on('evalServer', function(data){
		if(!DEBUG)
			return;
		
		var res = eval(data);
		socket.emit('evalAnswer', res);
	});
	
});

//Desc: Interval for the server, sends packets to client/s
//Speed: 40 p/s
setInterval(function(){	
	
		var pack_player = Player.getFrameUpdateData();
		Object.keys(SOCKET_LIST).forEach(key =>{

		var csocket = SOCKET_LIST[key].socket;

		if(pack_player.initPack.player[SOCKET_LIST[key].room_id] !== undefined){
			csocket.broadcast.to("room-" + SOCKET_LIST[key].room_id).emit('init',pack_player.initPack.player[SOCKET_LIST[key].room_id]);
		}
		if(pack_player.updatePack.player[SOCKET_LIST[key].room_id] !== undefined){
			csocket.emit('update',pack_player.updatePack.player[SOCKET_LIST[key].room_id]);
		}
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('remove',pack_player.removePack);
		
	});
	
}, 1000/25);