require('./card_s.js');
require('./hero_s.js');
require('./run_s.js');
require('./enums_s');
require('./deck_s.js');
require('./state_s.js');
require('../client/js/player_cards');
require('../client/js/keep');
require('./helpers_s.js');
require('./run_action_s.js');
require('../client/js/hero_action');
require('./action_s.js');
var sql = require('./mysql_s.js');

var initPack = {};				//Package sent to all clients in room when player connects initially
var removePack = {player:[]};	//Package sent to all clients when player disconnects
const GAMEPLAYERSIZE = 2;		//This needs to be passed in, in the future
const HEALTHMAX = 20; 			//This needs to be passed in, in the future

Player = function(param){
	var self = {
		health:HEALTHMAX,
		power_crystal:100, //set to 0
		power_crystal_used:0,
	}
	
	self.name = param.username;
	self.id = param.id;
	self.room_id = param.room_id;
	self.state = new State(param.socket, true);
	self.player_cards = new Player_Cards(param.socket, true);
	self.keep_cards = new Keep(param.socket, true);
	self.player_hero = null;
	self.hero_type = 3;// card_types[Math.floor(Math.random() * card_types.length)]; //Create Randomizer
	self.action = "";
	self.run_action = new Run_Action();
	self.hero_action = new Hero_Action(param.socket, true);

	self.getInitPack = function(){
		return {
			id:self.id,
			room_id:self.room_id,
			health:self.health,
			power_crystal:self.power_crystal,	
			power_crystal_used:self.power_crystal_used,
			name:self.name,		
			h_type:self.hero_type,
			hero:self.player_hero,
			state:self.state,
			action:self.action,
			ra:self.run_action.getInitPackRA(),
		};
	}
	
	self.getUpdatePack = function(){
			return {
				id:self.id,
				room_id:self.room_id,
				health:self.health,
				power_crystal:self.power_crystal,
				power_crystal_used:self.power_crystal_used,
				hero:self.player_hero,
				state:self.state,
				action:self.action,
				ra:self.run_action.getUpdatePackRA(),
				ha:self.hero_action.actions,
			};
	}

	self.addCardtoInvent = function(type, amount = 1){
		for(var i = 0; i < amount; i++)
			Action.keepActionHandler(self, 2);
			self.player_cards.addCard(Deck.getTopRunCard(type, self.room_id));
		return;
	}

	self.addCardtoInventByID = function(data){
		Action.keepActionHandler(self, 2);
		self.player_cards.addCard(Deck.getCardByID(data));
	}

	self.addCardtoKeepInventbyID = function(data){
		self.keep_cards.addKeepCard(data);
	}

	self.removeCardfromInvent = function(id){
		self.player_cards.removeCard(id);
		return;
	}

	self.assignHeroCard = function(id){
		self.player_hero = id;
		self.run_action.stat.setBaseStats(Hero.getBaseStats(id));
	}

	self.updateStates = function(states_info){
		self.state.updateStates(states_info);
	}

	self.PCUsedUpdateToAmount = function(amount){
		self.power_crystal_used = amount;
	}

	self.getHeroActionCard = function(hero_id){
            sql.getHeroActionInformation(hero_id, function(err, result){
                    if(!err){
                        for(var i in result){
                            self.hero_action.actions.push({id:result[i].hero_action_id, cost:result[i].hero_action_cost, desc:result[i].hero_action_desc});
                        }
                    }
					self.createHeroActionButtons();
                });

	}

	self.createHeroActionButtons = function(){
		self.hero_action.createHeroActionButtons();
	}

	self.updateAction = function(action_message){
		self.action = null;
		self.action = action_message;
	}

	/* Action effects */
	self.PCUsedUpdate = function(used_amount){
		self.power_crystal_used += used_amount;
	}
	self.statUpdateAtk = function(stat_inc, stat_len, stat_perm, stat_type){
		if(stat_inc !== 0){
			if(stat_perm === 0)
			{
				self.run_action.stat.atk_mod.push({atk_inc:stat_inc, atk_len:stat_len});
			}
			else
				self.run_action.stat.atk_perm_mod += stat_inc;
			self.run_action.stat.atk_mod_total += stat_inc;
		}
	}
	self.statUpdateDef = function(stat_inc, stat_len, stat_perm, stat_type){

		if(stat_inc !== 0){
			if(stat_perm === 0)
				self.run_action.stat.def_mod.push({def_inc:stat_inc, def_len:stat_len});
			else
				self.run_action.stat.def_perm_mod += stat_inc;
			self.run_action.stat.def_mod_total += stat_inc;
		}
	}
	self.statUpdateDodge = function(stat_inc, stat_len, stat_perm, stat_type){
		if(stat_inc !== 0){
			if(stat_perm === 0)
				self.run_action.stat.dodge_mod.push({dodge_inc:stat_inc, dodge_len:stat_len});
			else
				self.run_action.stat.dodge_perm_mod += stat_inc;
			self.run_action.stat.dodge_mod_total += stat_inc;
		}
	}
	self.healthUpdate = function(add, perm){
		var tempHealth = self.health + add;
		if(tempHealth > HEALTHMAX && perm === 1){
			self.healthModifier(add);
		}
		else if(tempHealth > HEALTHMAX && perm === 0){
			self.healthModifier((HEALTHMAX - self.health));
		}
		else{
			self.healthModifier(add);
		}
	}
	self.healthModifier = function(total){
		self.health += total;
	}
	//Need to fix this for the hard coded values
	self.drawCardUpdate = function(logic){
		var logic_out;
		logic_out = self.run_action.draw.getCardLogic(logic);
		if(logic_out.length <= 1 && (self.run_action.draw.getCardLogic(logic_out).length) <= 1){
			var invCards = Draw_Card.getDrawCardAmounts(logic_out);
			console.log("inv" + invCards.Death + invCards.Conquest + invCards.War + invCards.Plauge);
			if(invCards.Death > 0){
				self.addCardtoInvent('Death', invCards.Death);
			}
			if(invCards.Conquest > 0){
				self.addCardtoInvent('Conquest', invCards.Conquest);
			}
			if(invCards.War > 0){
				self.addCardtoInvent('War', invCards.War);
			}
			if(invCards.Plauge > 0){
				self.addCardtoInvent('Plauge', invCards.Plague);
			}
		}
		else{
			console.log("nop"); //tabling this until i figure you these should work

		}
	}
	self.powerCrystalModifier = function(total){
		self.power_crystal += total;
	}
	self.freeAttackEffect = function(dam, ig){
		Player.attackOpponent(self.id, self.room_id, dam, ig);
	}
	self.statTypetoValueEffect = function(amount, type){
		if(type === 4){//health
			self.health = amount;
		}
		else if(type === 6){//perm attack
			self.run_action.stat.atk_mod_total += (amount - self.run_action.stat.atk_perm_mod);
			self.run_action.stat.atk_perm_mod = amount;
		}
		else if(type === 7){//perm def
			self.run_action.stat.def_mod_total += (amount - self.run_action.stat.def_perm_mod);
			self.run_action.stat.def_perm_mod = amount;
		}
		else if(type === 8){//perm dodge
			console.log(self.run_action.stat.dodge_mod_total + " " + amount + " " + self.run_action.stat.dodge_perm_mod);
			self.run_action.stat.dodge_mod_total += (amount - self.run_action.stat.dodge_perm_mod);
			self.run_action.stat.dodge_perm_mod = amount;
		}
		else{

		}
	}
	/* Action effects end */

	Player.list[self.id] = self;
	initPack[self.room_id] = {player:[]};
	initPack[self.room_id].player.push(self.getInitPack());
	return self; 
}

Player.list = {};

Player.onConnect = function(socket, name, room){
		var player = Player({
		id:socket.id, 
		username:name,
		socket:socket,
		room_id:room,
		name:name});

		//Passes the player package to client that has just joined
		socket.emit('init',{
			selfId:socket.id,
			player:Player.getAllInitPack(room),
		});

		//Passes all heros to player when first connecting
		socket.emit('init_hero', {
			hero_l:Hero.getAllInitPack(room),
		});

		//Passes cards to admins upon load
		socket.emit('adminPushCards', Deck.getDeckCards(player.room_id));

		//Passes deck information to the player when first connecting
		socket.emit('pushDecks', Deck.getDeckTypes(player.room_id));

		socket.on('cardAction', function(id, type, boost){
			if(!player.player_cards.hasItem(id))
			{
				console.log("Cheater! Player ID: " + player.id);
			}
			else if(player.power_crystal < Deck.getCardCost(id, player.room_id))
			{
				console.log("Not enough PCs to player card!");
			}
			else{
				//Turned off for testing
				//if(player.state.play_cards){
					Deck.getDeckCardAction(id, type, player, boost);
					console.log("Cost Play: " +  Deck.getCardCost(id, player.room_id));
				//}
			}
		});

		socket.on('heroActionAction', function(id){
			Action.heroActionHandler(id, player);
		});
		
		socket.on('addRunCard', function(type){
			//Turned off for testing
			//if(player.state.choose_card){
				player.addCardtoInvent(type);
				player.updateStates({control:true,play_cards:true, activity:true});
			//}
		});

		socket.on('removeCards', function(data){
			player.removeCardfromInvent(data);
		});

		socket.on('addPlayerHeroCard', function(id){
			player.assignHeroCard(id);
			player.getHeroActionCard(id);
			//Assigns game states once all players have joined
			State.assignStatesInitial(Player.list, room, GAMEPLAYERSIZE); //GAMEPLAYERSIZE will need to be changed in the future
		});

		socket.on('attackActivity', function(){
			if(player.state.activity){
				Player.attackOpponent(player.id, room);
				State.changeControl(Player.list, player.id, room);
				player.updateStates();
			}
		});

		//Coward has two seperate things that can happen, this can be one
		socket.on('cowardActivity', function(){
			if(player.state.activity){
				player.power_crystal++;
				player.health-=2;
				player.updateAction("Took the cowards way out... Lost 2 life and gained 1 Power Crystal");
				Player.list[getOppID(room, player.id)].updateAction("");
				State.changeControl(Player.list, player.id, room);
				player.updateStates();
			}
		});

		socket.on('handleAdminRequest', function(data){
			console.log(data.code);
			if(data.code == 'draw'){
				player.drawCardUpdate(data.input1);
			}
			else if(data.code == 'free_attack'){
				player.freeAttackEffect(parseInt(data.input1), data.input2);
			}
			else if(data.code == 'health'){
				player.healthUpdate(parseInt(data.input1), data.input2);
			}
			else if(data.code == 'power_crystal'){
				player.powerCrystalModifier(parseInt(data.input1));
			}
			else if(data.code == 'stat'){
				if(data.input4 == 1){
					player.statUpdateAtk(parseInt(data.input1), parseInt(data.input2), data.input3, data.input4);
				}
				else if(data.input4 == 2){
					player.statUpdateDef(parseInt(data.input1), parseInt(data.input2), data.input3, data.input4);
				}
				else if(data.input4 == 3){
					player.statUpdateDodge(parseInt(data.input1), parseInt(data.input2), data.input3, data.input4);
				}
				else {

				}
			}
			else if(data.code == 'stat_type_to_value'){
				console.log(data.input2);
				player.statTypetoValueEffect(parseInt(data.input1), parseInt(data.input2));
			}	
			else{

			}
		});

		socket.on('handleAdminAddCard', function(data){
			player.addCardtoInventByID(data);
		});

}

Player.getFrameUpdateData = function(){

	var pack = {
		initPack:{
			player:initPack,
		},
		removePack:{
			player:removePack.player,
		},
		updatePack:{
			player:Player.update(),
		}
	};
	
	initPack = {};
	removePack.player = [];

	return pack;
}

//Creates init pack to send to player on connect, only players in room
Player.getAllInitPack = function(data){
	var players = [];
	let  p = null;
	for(var i in Player.list){
		p = Player.list[i].getInitPack();
		if(data == p.room_id)
			players.push(p);
	}
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(){
	var pack = {};
	for(var i in Player.list){
		let room = Player.list[i].room_id;
		let player = Player.list[i];
		let key = checkRoomExist(pack, room);
		if(key == null){
			pack[room] = {player:[]};
			pack[room].player.push(player.getUpdatePack());
		}
		else{
			pack[key].player.push(player.getUpdatePack());
		}
	}
	return pack;
}

Player.attackOpponent = function(cur_id, room, auto_damage = 0, ignore_def = 0){
	
	let opp_id = getOppID(room, cur_id);

	Action.keepActionHandler(Player.list[opp_id], 1);

	let opp_hero = Hero.list[Player.list[opp_id].player_hero];
	let atk_hero = Hero.list[Player.list[cur_id].player_hero];
	let opp_mod = Math.floor(Math.random() * 6);
	if((opp_hero.dodge + opp_mod) >= atk_hero.attack){
		console.log("Dodge: " + opp_hero.dodge + " Mod: " + opp_mod + " Attack: " + atk_hero.attack);
		Player.list[opp_id].updateAction("Dodge effective! " + opp_hero.dodge + " dodge + " + opp_mod + " modifier = " + (opp_hero.dodge + opp_mod));
		Player.list[cur_id].updateAction("Attack failed. Attack strength " + atk_hero.attack + " was avoided with " + (opp_hero.dodge + opp_mod) + " dodge");

	}
	else if(opp_hero.defense >= atk_hero.attack){
		console.log("Defense: " + opp_hero.defense + " Attack: " + atk_hero.attack);
		Player.list[opp_id].updateAction("Defense effective! " + opp_hero.defense + " defense was enough to stop the attack!");
		Player.list[cur_id].updateAction("Attack failed. Attack strength " + atk_hero.attack + " was defended with " + opp_hero.defense + " defense.");
	}
	else{
		console.log("Dodge: " + opp_hero.dodge + " Mod: " + opp_mod + " Defense: " + opp_hero.defense + " Attack: " + atk_hero.attack);
		let hitLost = 0;

		if(ignore_def == 1){
			hitLost = (auto_damage != 0) ? auto_damage : opp_hero.defense - atk_hero.attack;
		}
		else{
			hitLost = (auto_damage != 0) ? opp_hero.defense + auto_damage : opp_hero.defense - atk_hero.attack;
		}

		Player.list[opp_id].healthModifier(hitLost);
		Player.list[opp_id].updateAction("Took " + hitLost + " damage from the attack!");
		Player.list[cur_id].updateAction("Attack effective. Attack strength " + atk_hero.attack + " was stronger than " + opp_hero.defense + " defense.");
	}

}

