var sql = require('./mysql_s.js');
var util = require('util');
require('./helpers_s.js');

Action = function(){}

/* Handles the different kinds of actions */
Action.cardActionHandler = function(run_id, player, boost){
	var boost_val = boost == true ? 1 : 0;
	sql.getCardActions(run_id, boost_val, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				if(i == 0){
					Action.CostToPCUsed(result[0][i].run_cost, player);
				}
				if(result[0][i].action_keep > 0){
					player.addCardtoKeepInventbyID(result[0][i]);
				}
				else{
					Action.ActionHandler(result[0][i], player);
				}
			}
		}	
	});
}

Action.heroActionHandler = function(ha_id, player){
	sql.getHeroActionActions(ha_id, function(err, result){
		if(!err){
			for(var i = 0; i < result[0].length; i++){
				if(i == 0){
					Action.CostToPCUsed(result[0][i].run_cost, player);
				}
				Action.ActionHandler(result[0][i], player);
			}
		}	
	});
}

Action.keepActionHandler = function(player, actionCode){
	for(var i = 0; i < player.keep_cards.items.length; i++){
		if(player.keep_cards.items[i].actionEvent == actionCode){
			sql.getKeepCardAction(player.keep_cards.items[i].id, function(err, result){
				if(!err){
					for(var i = 0; i < result[0].length; i++){
						Action.ActionHandler(result[0][i], player);
					}
				}
			});
		}
	}
}

Action.ActionHandler = function(data, player){
	var opp = getOpp(player.room_id, player.id);
	var directed;
	directed = data.directed_code == 1 ? player : opp;
		if(data.boost_code > 0){
			Action.getBoostHandler(data.boost_code, player);
		}
		if(data.stat_id != null){
			Action.getStatHandler(data.stat_id, directed);
		}
		if(data.health_id != null){
			Action.getHealthHandler(data.health_id, directed);
		}
		if(data.draw_id != null){
			Action.getDrawHandler(data.draw_id, directed);
		}
		if(data.power_crystal_id != null){
			Action.getPCHandler(data.power_crystal_id, directed);
		}
		if(data.free_attack_id != null){
			Action.freeAttackHandler(data.free_attack_id, directed);
		}
		if(data.stat_type_to_value_id != null){
			Action.statTypetoValueHandler(data.stat_type_to_value_id, directed);
		}
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


