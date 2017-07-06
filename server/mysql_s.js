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
                
                conn.query('call getDeck()', function(err, rows, fields){
                    if(!err){
                        callback(null, rows);
                    }
                    else
                    {
                        console.log('Error ~ getConnection() ~ mysql_s');
                    }
                });
            }

           conn.release();
        }  
    );
}

exports.getActions = function(r_id, ha_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "CALL getActions(?,?);";
            conn.query(sqlString,[r_id, ha_id], function(err, rows, fields){
                if(!err){
                    console.log("callback");
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getActions() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}


/*
    Purpose: gets hero action action
    Pre: id ~ hero_action_ids, callback ~ funcation used to return information
    Post: rows ~ callback funcation used to pass row informaiton
*/
exports.getHeroActionAction = function(id,callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            conn.query('select ha.draw_id, ha.health_id, ha.power_crystal_id, ha.special_id, ha.stat_id, ha.stat_special_id, d.draw_logic, h.health_add, h.health_above_max, pc.power_crystal_add, s.special_next_to_perm, s.special_remove_enemy_perm, s.special_remove_enemy_atk_perm, '
                        + 's.special_health_multiply, st.stat_atk_increase, st.stat_atk_turn_len, st.stat_atk_perm, st.stat_def_increase, st.stat_def_turn_len, st.stat_def_perm,  '
                        + 'st.stat_dodge_increase, st.stat_dodge_turn_len, st.stat_dodge_perm, ss.stat_special_atk_increase_card_multi, ss.stat_special_def_multi, ss.stat_special_dodge_multi_cur '
                        + 'from hero_action as ha '
                        + 'left join draw as d on d.draw_id = ha.draw_id '
                        + 'left join health as h on h.health_id = ha.health_id '
                        + 'left join power_crystal as pc on pc.power_crystal_id = ha.power_crystal_id '
                        + 'left join special as s on s.special_id = ha.special_id '
                        + 'left join stat as st on st.stat_id = ha.stat_id '
                        + 'left join stat_special as ss on ss.stat_special_id = ha.stat_special_id '
                        + 'where ha.hero_action_id = ?'
                        ,[id], function(err, rows, fiedls){
                            if(!err){
                                callback(null, rows);
                            }
                            else{
                                console.log('Error ~ getHeroActionInformation() ~ mysql_s');
                            }
                        });
        }
        conn.release();
    });
}

/*
    Purpose: Gets all information needed for the hero table to be used to create a List of Heros
    Pre: callback ~ funcation used to return information
    Post: rows ~ callback funciton used to pass row information
*/
exports.getHeroList = function(callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            conn.query('select h.hero_id, h.hero_name, h.hero_desc, h.hero_base_atk, h.hero_base_def, h.hero_base_dodge, ht.hero_type as type_base, ht2.hero_type as type_sub '
                        + 'from hero as h '
                        + 'join hero_type as ht on ht.hero_id = h.hero_id and ht.hero_type_base = 1 '
                        + 'left join ( select hero_id, hero_type, hero_type_base '
                                    + 'from hero_type '
                                    + 'where hero_type_base = 0) as ht2 on ht2.hero_id = h.hero_id '
                        , function(err, rows, fiedls){
                            if(!err){
                                callback(null, rows);
                            }
                            else{
                                console.log('Error ~ getHeroList() ~ mysql_s');
                            }
                        });
        }
        conn.release();
    });
}

/*
    Purpose: Gets the main information for all hero actions associated with a hero
    Pre: id ~ hero_id, callback ~ funcation used to return information
    Post: rows ~ callback funcation used to pass row informaiton
*/
exports.getHeroActionInformation = function(id,callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            conn.query('select hero_action_id, hero_action_cost, hero_action_desc '
                        + 'from hero_action '
                        + 'where hero_id = ? '
                        + 'order by hero_action_cost'
                        , [id], function(err, rows, fiedls){
                            if(!err){
                                callback(null, rows);
                            }
                            else{
                                console.log('Error ~ getHeroActionInformation() ~ mysql_s');
                            }
                        });
        }
        conn.release();
    });
}


/* Action Effects */

exports.getCardActions = function(r_id,boost, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getCardActions(?,?);";
            conn.query(sqlString,[r_id,boost], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getCardAction() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getHeroActionActions = function(ha_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getHeroActionActions(?);";
            conn.query(sqlString,[ha_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getHeroActionActions() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getStatEffect = function(s_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getStatEffect(?);";
            conn.query(sqlString,[s_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getStatEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getHealthEffect = function(h_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getHealthEffect(?);";
            conn.query(sqlString,[h_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getHealthEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getDrawEffect = function(d_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getDrawEffect(?);";
            conn.query(sqlString,[d_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getDrawEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getPCEffect = function(pc_id, callback){
    pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getPCEffect(?);";
            conn.query(sqlString,[pc_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getPCEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getFAEffect = function(fa_id, callback){
pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getFAEffect(?);";
            conn.query(sqlString,[fa_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getFAEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

exports.getStatTypetoValueEffect = function(st_id, callback){
pool.getConnection(function(err, conn){
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
        else{
            var sqlString = "call getStatTypetoValueEffect(?);";
            conn.query(sqlString,[st_id], function(err, rows, fields){
                if(!err){
                    callback(null, rows);
                }
                else{
                    console.log('Error ~ getStatTypetoValueEffect() ~ mysql_s');
                }
            });
        }
        conn.release();
    });
}

/* Action Effects end */
