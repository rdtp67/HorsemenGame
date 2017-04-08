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
            ctx_ui_player_hero.fillText("Hero Name: " + Player.list[selfId].hero_name,755,460);
            ctx_ui_player_hero.fillText("Hero Attack: " + Player.list[selfId].hero_attack,755,490);
            ctx_ui_player_hero.fillText("Hero Defense: " + Player.list[selfId].hero_defense,755,520);
            ctx_ui_player_hero.fillText("Hero Dodge: " + Player.list[selfId].hero_dodge,755,550);

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
                    ctx_ui_enemy_hero.fillText("Enemy Name: " + Player.list[i].hero_name,205,260);
                    ctx_ui_enemy_hero.fillText("Enemy Attack: " + Player.list[i].hero_attack,205,290);
                    ctx_ui_enemy_hero.fillText("Enemy Defense: " + Player.list[i].hero_defense,205,320);
                    ctx_ui_enemy_hero.fillText("Enemy Dodge: " + Player.list[i].hero_dodge,205,350);
                    return;
                }
                    
            }
	}

    var drawBackgroundHero = function(){
		ctx_hero.drawImage(Img.background_hero, 0, 0, 1500, 800);
	}

    var drawHeroSelect = function(){
        if(!selfId)
            return;
         else{
            ctx_hero.font="40px Georgia";
            ctx_hero.fillText("Hero Type: " + Player.list[selfId].hero_type, 550, 50);
            ctx_hero.font = '20px Arial';
         }
    }

	var drawPlayerHeroCards = function(){

		if(!selfId)
			return;

			var invent = document.getElementById("hero_cards");
        	invent.innerHTML = "";
        	var addButtonHero = function(data){
            	let buttonh = document.createElement('button');
            	buttonh.onclick = function(){
                	socket.emit('addPlayerHeroCard',data.id);
					heroPickDiv.style.display = 'none';
    				gameDiv.style.display = 'inline-block';
            	}
           		buttonh.innerText = data.title;
            	invent.appendChild(buttonh);
			}

			for(var i in Hero.list){
					if(Hero.list[i].horsemen_type == Player.list[selfId].hero_type){
						addButtonHero(Hero.list[i]);
					}
			}
	}

  