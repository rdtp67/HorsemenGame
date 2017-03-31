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

//Debug = false when live
var DEBUG = true;

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){
	console.log('User Connected');
	
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
	 socket.on('signIn',function(data){
                Player.onConnect(socket, data.username);
                socket.emit('signInResponse',{success:true});
    });
    socket.on('signUp',function(data){
                socket.emit('signUpResponse',{success:false});      
    });
				
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
		console.log('User Disconnected');
	});
	
	socket.on('sendMsgToServer',function(data){
        var playerName = Player.list[socket.id].name;
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
        }
    });
	
	socket.on('evalServer', function(data){
		if(!DEBUG)
			return;
		
		var res = eval(data);
		socket.emit('evalAnswer', res);
	});
	
});

setInterval(function(){
	var pack_decks = Deck.getFrameUpdateDataDeck();
	var pack_player = Player.getFrameUpdateData();
	var pack_hero = Hero.getFrameUpdateData();
	var pack_death = Death.getFrameUpdateDataDeath();
	var pack_plague = Plague.getFrameUpdateDataPlague();
	var pack_war = War.getFrameUpdateDataWar();
	var pack_conquest = Conquest.getFrameUpdateDataConquest();
	var pack_run_update = {death:pack_death.updatePack_death,plague:pack_plague.updatePack_plague,war:pack_war.updatePack_war,conquest:pack_conquest.updatePack_conquest}
	var pack_run_remove = {death:pack_death.removePack_death,plague:pack_plague.removePack_plague,war:pack_war.removePack_war,conquest:pack_conquest.removePack_conquest};
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',pack_player.initPack);
		socket.emit('update',pack_player.updatePack);
		socket.emit('remove',pack_player.removePack);
		
		socket.emit('init_hero',pack_hero.initPack_hero);
		socket.emit('update_hero',pack_hero.updatePack_hero);
		socket.emit('remove_hero',pack_hero.removePack_hero);

		socket.emit('update_run',pack_run_update);
		socket.emit('remove_run',pack_run_remove);

		socket.emit('init_decks', pack_decks.initPack_deck);
		socket.emit('update_decks', pack_decks.updatePack_deck);
		socket.emit('remove_decks', pack_decks.removePack_deck);
	}	
}, 1000/25);