var sql = require('./mysql_s.js');
var util = require('util');
require('./helpers_s.js');

Action = function(){}

/*Action.getHeroActions = function(action_id, player){
    sql.getHeroActionAction(action_id, function(err, result){
		if(!err){
			let action = result[0];			
			//console.log("Action: " + util.inspect(action, false, null));
			if(action.stat_id !== null){
				player.statUpdate({atk_inc:action.stat_atk_increase, 
									atk_len:action.stat_atk_turn_len, 
									atk_perm:action.stat_atk_perm,
									def_inc:action.stat_def_increase, 
									def_len:action.stat_def_turn_len, 
									def_perm:action.stat_def_perm,
									dodge_inc:action.stat_dodge_increase, 
									dodge_len:action.stat_dodge_turn_len, 
									dodge_perm:action.stat_dodge_perm,});
			}

			if(action.power_crystal_id !== null){
				player.powerCrystalModifier(action.power_crystal_add);
			}

			if(action.draw_id !== null){
				player.drawCardUpdate(action.draw_logic);
			}
            if(action.health_id !== null){
                console.log("here " + action.health_id + " " + action.health_add + " " + action.health_above_max);
				player.healthUpdate({h_add:action.health_add,
									 h_perm:action.health_above_max,});
			}
		}
	});	
}*/

//Purpose: Get the card event for the card action requested
//pulls the information from the database at this point for the one card
//Pre: id: run_id for the run card needing event, player: player with the card
/*Deck.getEventForCard = function(id, player, boost){
	Action.test(id,player,boost);
	sql.getCardAction(id, function(err, result){
		var run = {};//Will contain all run card instance for the id, index is on boost to tell the difference between standard and boost
		if(!err){
			for(var i in result){
				let card = result[i];			
				run[card.run_boost] = card;
			}

			let c_instance_type = (boost === true) ? 1 : 0; //run_boost 1: boosted, 0: not boosted (standard run card)
			var c_instance = run[c_instance_type];

			console.log("Run: " + util.inspect(c_instance, false, null));

			if(c_instance.stat_id !== null){
				player.statUpdate({atk_inc:c_instance.stat_atk_increase, 
									atk_len:c_instance.stat_atk_turn_len, 
									atk_perm:c_instance.stat_atk_perm,
									def_inc:c_instance.stat_def_increase, 
									def_len:c_instance.stat_def_turn_len, 
									def_perm:c_instance.stat_def_perm,
									dodge_inc:c_instance.stat_dodge_increase, 
									dodge_len:c_instance.stat_dodge_turn_len, 
									dodge_perm:c_instance.stat_dodge_perm,});
			}

			if(c_instance.power_crystal_id !== null){
				player.powerCrystalModifier(c_instance.power_crystal_add);
			}

			if(c_instance.draw_id !== null){
				player.drawCardUpdate(c_instance.draw_logic);
			}

			if(c_instance.health_id !== null){
				player.healthUpdate({h_add:c_instance.health_add,
									 h_perm:c_instance.health_above_max,});
			}


		}
	});
}*/

/* Handles the different kinds of actions */
Action.cardActionHandler = function(run_id, player, boost){
	var boost_val = boost == true ? 1 : 0;
	sql.getCardActions(run_id, boost_val, function(err, result){
		if(!err){
			var opp = getOpp(player.room_id, player.id);
			var directed;
			for(var i = 0; i < result[0].length; i++){
				directed = result[0][i].directed_code == 1 ? player : opp;
				if(i == 0){
					Action.CostToPCUsed(result[0][i].run_cost, player);
				}
				if(result[0][i].boost_code > 0){
					Action.getBoostHandler(result[0][i].boost_code, player);
				}
				if(result[0][i].stat_id != null){
					Action.getStatHandler(result[0][i].stat_id, directed);
				}
				if(result[0][i].health_id != null){
					Action.getHealthHandler(result[0][i].health_id, directed);
				}
				if(result[0][i].draw_id != null){
					Action.getDrawHandler(result[0][i].draw_id, directed);
				}
				if(result[0][i].power_crystal_id != null){
					Action.getPCHandler(result[0][i].power_crystal_id, directed);
				}
				if(result[0][i].free_attack_id != null){
					Action.freeAttackHandler(result[0][i].free_attack_id, directed);
				}
				if(result[0][i].stat_type_to_value_id != null){
					Action.statTypetoValueHandler(result[0][i].stat_type_to_value_id, directed);
				}
			}
		}	
	});
}

Action.heroActionHandler = function(ha_id, player){
	sql.getHeroActionActions(ha_id, function(err, result){
		if(!err){
			var opp = getOpp(player.room_id, player.id);
			var directed;
			for(var i = 0; i < result[0].length; i++){
				directed = result[0][i].directed_code == 1 ? player : opp;
				if(i == 0){
					Action.CostToPCUsed(result[0][i].run_cost, player);
				}
				if(result[0][i].stat_id != null){
					Action.getStatHandler(result[0][i].stat_id, directed);
				}
				if(result[0][i].health_id != null){
					Action.getHealthHandler(result[0][i].health_id, directed);
				}
				if(result[0][i].draw_id != null){
					Action.getDrawHandler(result[0][i].draw_id, directed);
				}
				if(result[0][i].power_crystal_id != null){
					Action.getPCHandler(result[0][i].power_crystal_id, directed);
				}
				if(result[0][i].free_attack_id != null){
					Action.freeAttackHandler(result[0][i].free_attack_id, directed);
				}
				if(result[0][i].stat_type_to_value_id != null){
					Action.statTypetoValueHandler(result[0][i].stat_type_to_value_id, directed);
				}
			}
		}	
	});
}



Action.cardHorsemanCardHandler = function(){
	//need to add in check bool var for deck class
	//need to pull bool from horsemen talbe in getDeck sp
	//go threw all stored procs to exclude from horse
}

/***** Action Effect Handlers *****/

Action.CostToPCUsed = function(cost, player){
	player.PCUsedUpdate(cost);
}

Action.getBoostHandler = function(boost_code, player){
	 if(boost_code > 0 && boost_code <=20){
		var pc_mod = -1 * boost_code;
		player.powerCrystalModifier(pc_mod);
	 }
	 else if(boost_code > 20 && boost_code <= 40){
		var health_mod = -1 * (boost_code - 20);
		player.healthModifier(health_mod);
	 }	
	 else if(boost_code > 40 && boost_code <= 60){
		 var discard_amount = -1 * (boost_code - 40);
		 console.log(discard_amount + " cards removed. Need to add in UI for choosing card remove.");
	 }
	 else if(boost_code > 60 && boost_code <= 80){
		 var pcUsedAmount = (boost_code - 60);
		 player.PCUsedUpdate(pcUsedAmount);
	 }
	 else{

	 }
}

Action.getStatHandler = function(stat_id, player){
	sql.getStatEffect(stat_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				if(result[0][i].stat_type === 1){
					player.statUpdateAtk(result[0][i].stat_increase, result[0][i].stat_turn_len, result[0][i].stat_turn_perm, result[0][i].stat_type);
				}
				if(result[0][i].stat_type === 2){
					player.statUpdateDef(result[0][i].stat_increase, result[0][i].stat_turn_len, result[0][i].stat_turn_perm, result[0][i].stat_type);
				}
				if(result[0][i].stat_type === 3){
					player.statUpdateDodge(result[0][i].stat_increase, result[0][i].stat_turn_len, result[0][i].stat_turn_perm, result[0][i].stat_type);
				}
				if(result[0][i].stat_type > 3){
					console.log("Need to add in UI for everything greater");
				}
			}
		}
	});
}

Action.getHealthHandler = function(health_id, player){
	sql.getHealthEffect(health_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				player.healthUpdate(result[0][i].health_add, result[0][i].health_above_max);
			}
		}
	});
}

Action.getDrawHandler = function(draw_id, player){
	sql.getDrawEffect(draw_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				player.drawCardUpdate(result[0][i].draw_logic);
			}
		}
	});
}

Action.getPCHandler = function(pc_id, player){
	sql.getPCEffect(pc_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				player.powerCrystalModifier(result[0][i].power_crystal_add);
			}
		}
	});
}

Action.freeAttackHandler = function(fa_id, player){
	sql.getFAEffect(fa_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				player.freeAttackEffect(result[0][i].free_attack_damage_amount, result[0][i].free_attack_ignor_defense);
			}
		}
	});
}

Action.statTypetoValueHandler = function(st_id, player){
	sql.getStatTypetoValueEffect(st_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				player.statTypetoValueEffect(result[0][i].stat_type_to_value_amount, result[0][i].stat_type_code);
			}
		}
	});
}

/***** Action Effect Handlers end *****/


