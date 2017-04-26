require('./stat_s.js');
require('./draw_card_s');

Run_Action = function(){
   var self = {

    }
    self.stat =  new Stat()
    self.draw = new Draw_Card();

    self.checkTurnEnd = function(){
        self.stat.checkTurnEnd();
    }

    self.getInitPackRA = function(){
        return {
            stat_atk_base:self.stat.atk_base,
            stat_atk_mod_total:self.stat.atk_mod_total,
            stat_atk_perm_mod:self.stat.atk_perm_mod,

            stat_def_base:self.stat.def_base,
            stat_def_mod_total:self.stat.def_mod_total,
            stat_def_perm_mod:self.stat.def_perm_mod,

            stat_dodge_base:self.stat.dodge_base,
            stat_dodge_mod_total:self.stat.dodge_mod_total,
            stat_dodge_perm_mod:self.stat.dodge_perm_mod,

        };
    }

    self.getUpdatePackRA = function(){
        return {
            stat_atk_base:self.stat.atk_base,
            stat_atk_mod_total:self.stat.atk_mod_total,
            stat_atk_perm_mod:self.stat.atk_perm_mod,

            stat_def_base:self.stat.def_base,
            stat_def_mod_total:self.stat.def_mod_total,
            stat_def_perm_mod:self.stat.def_perm_mod,

            stat_dodge_base:self.stat.dodge_base,
            stat_dodge_mod_total:self.stat.dodge_mod_total,
            stat_dodge_perm_mod:self.stat.dodge_perm_mod,
        };
    }

    return self;

}

            