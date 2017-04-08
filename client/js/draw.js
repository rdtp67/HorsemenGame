    var drawBackground = function(){
		ctx.drawImage(Img.background, 0, 0, 1500, 800);
	}

	var drawCardsLeft = function(){
		if(!selfId)
				return;
		else
			ctx_ui_cards_left.clearRect(0,0,1500,800);
			ctx_ui_cards_left.beginPath();
			ctx_ui_cards_left.lineWidth="4";
			ctx_ui_cards_left.strokeStyle="white";
			ctx_ui_cards_left.rect(0,0,200,800);
			ctx_ui_cards_left.stroke();

	}

	var drawCardsRight = function(){
		if(!selfId)
				return;
		else
			ctx_ui_cards_right.clearRect(0,0,1500,800);
			ctx_ui_cards_right.beginPath();
			ctx_ui_cards_right.lineWidth="4";
			ctx_ui_cards_right.strokeStyle="blue";
			ctx_ui_cards_right.rect(1300,0,200,800);
			ctx_ui_cards_right.stroke();

	}

	var drawCardsPlayer = function(){
		if(!selfId)
				return;
		else
			ctx_ui_cards_player.clearRect(0,0,1500,800);
			ctx_ui_cards_player.beginPath();
			ctx_ui_cards_player.lineWidth="4";
			ctx_ui_cards_player.strokeStyle="pink";
			ctx_ui_cards_player.rect(200,600,1100,200);
			ctx_ui_cards_player.stroke();

	}

var drawCardsEnemy = function(){
		if(!selfId)
				return;
		else
			ctx_ui_cards_enemy.clearRect(0,0,1500,800);
			ctx_ui_cards_enemy.beginPath();
			ctx_ui_cards_enemy.lineWidth="4";
			ctx_ui_cards_enemy.strokeStyle="green";
			ctx_ui_cards_enemy.rect(200,000,1100,200);
			ctx_ui_cards_enemy.stroke();

	}

	var drawPlayerHero = function(){
		if(!selfId)
				return;
		if(lastHealth === Player.list[selfId].health && lastPowerCrystal === Player.list[selfId].power_crystal && lastHeroName === Player.list[selfId].hero_name)
			return;
		else
			ctx_ui_player_hero.clearRect(0,0,1500,800);
			ctx_ui_player_hero.beginPath();
			ctx_ui_player_hero.lineWidth="4";
			ctx_ui_player_hero.strokeStyle="yellow";
			ctx_ui_player_hero.rect(750,400,550,200);
			ctx_ui_player_hero.stroke();
			lastHealth = Player.list[selfId].health;
			lastPowerCrystal = Player.list[selfId].power_crystal;
			ctx_ui_player_hero.fillStyle = 'white';
			ctx_ui_player_hero.fillText("Health: " + Player.list[selfId].health,1025,430);
			ctx_ui_player_hero.fillText("Power Crystals: " + Player.list[selfId].power_crystal,755,430);
			let hero_id = Player.list[selfId].player_hero;
			if(hero_id !== undefined && hero_id !== null){
				let hero = Hero.list[hero_id];
            	ctx_ui_player_hero.fillText("Hero Name: " + hero.title,755,460);
            	ctx_ui_player_hero.fillText("Hero Attack: " + hero.attack,755,490);
            	ctx_ui_player_hero.fillText("Hero Defense: " + hero.defense,755,520);
            	ctx_ui_player_hero.fillText("Hero Dodge: " + hero.dodge,755,550);
			}

	}

	var drawEnemyHero = function(){
		if(!selfId)
				return;
		else
			ctx_ui_enemy_hero.clearRect(0,0,1500,800);
			ctx_ui_enemy_hero.beginPath();
			ctx_ui_enemy_hero.lineWidth="4";
			ctx_ui_enemy_hero.strokeStyle="purple";
			ctx_ui_enemy_hero.rect(200,200,550,200);
			ctx_ui_enemy_hero.stroke();
            ctx_ui_enemy_hero.fillStyle = 'white';
            for(var i in Player.list)
            {
                if(Player.list[i].id !== selfId){
                    ctx_ui_enemy_hero.fillText("Health: " + Player.list[i].health,475,230);
                    ctx_ui_enemy_hero.fillText("Power Crystals: " + Player.list[i].power_crystal,205,230);
					
					let hero_id = Player.list[i].player_hero;
					if(hero_id !== undefined && hero_id !== null){
						let hero = Hero.list[hero_id];
                    	ctx_ui_enemy_hero.fillText("Enemy Name: " + hero.title,205,260);
                    	ctx_ui_enemy_hero.fillText("Enemy Attack: " + hero.attack,205,290);
                    	ctx_ui_enemy_hero.fillText("Enemy Defense: " + hero.defense,205,320);
                    	ctx_ui_enemy_hero.fillText("Enemy Dodge: " + hero.dodge,205,350);
					}
                    return;
                }
                    
            }
	}