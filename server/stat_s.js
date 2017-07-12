
Stat = function(){
    var self = {
        atk_base:0,
        atk_mod_total:0,
        atk_perm_mod:0,//permenant atk increase
        atk_mod:[],//{atk_inc,atk_len}

        def_base:0,
        def_mod_total:0,
        def_perm_mod:0,
        def_mod:[],

        dodge_base:0,
        dodge_mod_total:0,
        dodge_perm_mod:0,
        dodge_mod:[],
    }

    self.setBaseStats = function(data){
        self.atk_base = data.atk;
        self.def_base = data.def;
        self.dodge_base = data.dodge;
    }

    self.checkTurnEnd = function(){

        
        for(var j = self.atk_mod.length - 1; j >= 0; j--){
            self.atk_mod[j].atk_len--;
            if(self.atk_mod[j].atk_len < 1){
                self.atk_mod_total -= self.atk_mod[j].atk_inc;
                self.atk_mod.splice(j, 1);
            }
        }

        for(var j = self.def_mod.length - 1; j >= 0; j--){
            self.def_mod[j].def_len--;
            if(self.def_mod[j].def_len < 1){
                self.def_mod_total -= self.def_mod[j].def_inc;
                self.def_mod.splice(j, 1);
            }
        }

        for(var j = self.dodge_mod.length - 1; j >= 0; j--){
            self.dodge_mod[j].dodge_len--;
            if(self.dodge_mod[j].dodge_len < 1){
                self.dodge_mod_total -= self.dodge_mod[j].dodge_inc;
                self.dodge_mod.splice(j, 1);
            }
        }
    }

    return self;
}