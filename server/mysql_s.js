var mysql = require('mysql');
//require('./deck_s.js');
var exports = module.exports = {};

//Possibly create pooling in the future to limit connecitons at one time
var pool = mysql.createPool({
    connectionLimit:100,
    host:'198.71.227.92',
    user:'mav26',
    password:'koU0c!55',
    database:'rdtp67_Horsemen_TEST'
});

//Change to Stored PROC
 exports.getDeck = function(callback){
    pool.getConnection(function(err, conn){
            if(err){
                console.log(err.code);
                console.log(err.fatal);
            }
            else{
                conn.query('select * from run', function(err, rows, fields){
                    if(!err){
                        callback(null, rows);
                    }
                    else
                    {
                        console.log('Example failed');
                    }
                });
            }

           conn.release();
        }  
    );
}

//comment needed
exports.getCardAction = function(id,callback){
    console.log("ID1: " + id);
    pool.getConnection(function(err, conn){
        console.log("ID: " + id);
        if(err){
                console.log(err.code);
                console.log(err.fatal);
            }
            else{
                conn.query('select distinct r.run_id, r.run_keep, r.run_boost, r.run_horsemen, r.draw_id, d.draw_logic, r.health_id, h.health_add, h.health_above_max,'
                            + ' r.hero_id, hr.hero_name, r.hero_action_id, ha.hero_action_cost_modifier, r.power_crystal_id, pc.power_crystal_add,'
                            + ' r.special_id, s.special_next_to_perm, s.special_remove_enemy_perm, s.special_remove_enemy_atk_perm, s.special_health_multiply, r.stat_id, st.stat_atk_increase, st.stat_atk_turn_len,'
                            + ' st.stat_atk_perm, st.stat_def_increase, st.stat_def_turn_len, st.stat_def_perm, st.stat_dodge_increase, st.stat_dodge_turn_len, st.stat_dodge_perm,'
                            + ' r.stat_special_id, ss.stat_special_atk_increase_card_multi, ss.stat_special_def_multi, ss.stat_special_dodge_multi_cur'
                            + ' from run r'
                            + ' left join draw d on d.draw_id = r.draw_id'
                            + ' left join health h on h.health_id = r.health_id'
                            + ' left join hero hr on hr.hero_id = r.hero_id'
                            + ' left join hero_action ha on ha.hero_action_id = r.hero_action_id'
                            + ' left join power_crystal pc on pc.power_crystal_id = r.power_crystal_id'
                            + ' left join special s on s.special_id = r.special_id'
                            + ' left join stat st on st.stat_id = r.stat_id'
                            + ' left join stat_special ss on ss.stat_special_id = r.stat_special_id'
                            + ' where r.run_id = ?;', [id], function(err, rows, fields){
                    if(!err){
                        callback(null, rows);
                    }
                    else
                    {
                        console.log('Example failed');
                    }
                });
            }

           conn.release();
        }  
    );
}

