var express = require('express');
var app = express();
var server = require('http').Server(app);

require('./server/player_s');
require('./server/hero_s');
require('./client/js/player_cards');
require('./client/js/player_hero');
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

//Debug = false when live
var DEBUG = true;

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){

	if(io.nsps['/'].adapter.rooms["room-"+room_num] && io.nsps['/'].adapter.rooms["room-"+room_num].length > 1)
    	room_num++;
  	socket.join("room-"+room_num);
	console.log("Room: " + room_num);
	var cur_room = room_num;

	io.sockets.in("room-"+room_num).emit('connectToRoom', "You are in room no. "+room_num);
	var size = 0;
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = {socket:socket, room_id:cur_room};

	 socket.on('signIn',function(data){
		 if(Player.list)
                Player.onConnect(socket, data.username, cur_room);
                socket.emit('signInResponse',{success:true, room_id:room_num});
		 Object.keys(Player.list).forEach(key =>{
			size++;
		 });
		 console.log("Players: " + size);
    });
    socket.on('signUp',function(data){
                socket.emit('signUpResponse',{success:false});      
    });
				
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		socket.leave("room-"+room_num);
		console.log('User Disconnected');
	});

	socket.on('sendMsgToServer',function(data){
        var playerName = Player.list[socket.id].name;
		var socket_c = SOCKET_LIST[socket.id].socket;
		socket_c.broadcast.to("room-" + data.room_id).emit('addToChat',playerName + ': ' + data.value);
    });
	
	socket.on('evalServer', function(data){
		if(!DEBUG)
			return;
		
		var res = eval(data);
		socket.emit('evalAnswer', res);
	});
	
});

var si = 0;
setInterval(function(){	
	/*var types = [];
	var iterate_types = [];

	Object.keys(SOCKET_LIST).forEach(key =>{
		types.push(SOCKET_LIST[key].room_id);
	});	

	iterate_types = [... new Set(types)];
	for(var value in iterate_types){
		var pack_player = Player.getFrameUpdateData(value);
		var pack_hero = Hero.getFrameUpdateData();		//Is hero needed?

		io.sockets.in("room-" + value).emit('init',pack_player.initPack);
		io.sockets.in("room-" + value).emit('update',pack_player.updatePack);
		io.sockets.in("room-" + value).emit('remove',pack_player.removePack);
		
		io.sockets.in("room-" + value).emit('init_hero',pack_hero.initPack_hero);
		io.sockets.in("room-" + value).emit('update_hero',pack_hero.updatePack_hero);
		io.sockets.in("room-" + value).emit('remove_hero',pack_hero.removePack_hero);
	}*/

		var pack_player = Player.getFrameUpdateData();
		var pack_hero = Hero.getFrameUpdateData();		//Is hero needed?
		Object.keys(SOCKET_LIST).forEach(key =>{

		var csocket = SOCKET_LIST[key].socket;

		for(var i = 0; i < pack_player.initPack.player.length; i++){
			if(pack_player.initPack.player[i].room_id == SOCKET_LIST[key].room_id)
				io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('init',pack_player.initPack.player[i]);
		}
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('update',pack_player.updatePack);
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('remove',pack_player.removePack);

		if(pack_player.initPack.player.length > 0)
		console.log(pack_player.initPack);
		
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('init_hero',pack_hero.initPack_hero);
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('update_hero',pack_hero.updatePack_hero);
		io.sockets.in("room-" + SOCKET_LIST[key].room_id).emit('remove_hero',pack_hero.removePack_hero);

	});
	

	/*var pack_player = Player.getFrameUpdateData();
	var pack_hero = Hero.getFrameUpdateData();
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i].socket;
		socket.emit('init',pack_player.initPack);
		socket.emit('update',pack_player.updatePack);
		socket.emit('remove',pack_player.removePack);


		if(pack_player.initPack.player.length > 0){
			console.log(pack_player.initPack);
			console.log(si);
			si++;
		}
		
		socket.emit('init_hero',pack_hero.initPack_hero);
		socket.emit('update_hero',pack_hero.updatePack_hero);
		socket.emit('remove_hero',pack_hero.removePack_hero);
	}*/

	
}, 1000/25);