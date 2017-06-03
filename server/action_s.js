var sql = require('./mysql_s.js');

Action = function(){}

Action.getHeroActions = function(action_id, player){
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
}

