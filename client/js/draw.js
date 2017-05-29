var drawBackground = function(){
	ctx.drawImage(Img.background, 0, 0, 1500, 800);
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
	if(lastHealth !== Player.list[selfId].health || lastPowerCrystal !== Player.list[selfId].power_crystal || lastHeroName !== Player.list[selfId].hero_name){
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
		ctx_ui_player_hero.fillText("Hero Attack: " + Player.list[selfId].atk_base + " + " + Player.list[selfId].atk_mod_total,755,490);
		ctx_ui_player_hero.fillText("Hero Defense: " + Player.list[selfId].def_base + " + " + Player.list[selfId].def_mod_total,755,520);
		ctx_ui_player_hero.fillText("Hero Dodge: " + Player.list[selfId].dodge_base + " + " + Player.list[selfId].dodge_mod_total,755,550);
		let hero_id = Player.list[selfId].player_hero;
		if(hero_id !== undefined && hero_id !== null){
			let hero = Hero.list[hero_id];
			ctx_ui_player_hero.fillText("Hero Name: " + hero.title,755,460);
		}
	}

}

var drawEnemyHero = function(){
	if(!selfId)
			return;

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
				ctx_ui_enemy_hero.fillText("Enemy Attack: " + Player.list[i].atk_base,205,290);
					ctx_ui_enemy_hero.fillText("Enemy Defense: " + Player.list[i].def_base,205,320);
					ctx_ui_enemy_hero.fillText("Enemy Dodge: " + Player.list[i].dodge_base,205,350);
				
				let hero_id = Player.list[i].player_hero;
				if(hero_id !== undefined && hero_id !== null){
					let hero = Hero.list[hero_id];
					ctx_ui_enemy_hero.fillText("Enemy Name: " + hero.title,205,260);
				}
				return;
			}
				
		}
}



//Desc: Draws the clients state on the right side of the screen, this is for general testing purposes
//Pre: null
//Post: null
var drawPlayerState = function(){
	let state = Player.list[selfId].state;
	let user = Player.list[selfId].name;
	if(!selfId || !state)
		return;
	if(lastControl !== state.control || lastChooseCard !== state.choose_card || lastPlayCards !== state.play_cards || lastActivity !== state.activity){

		lastControl = state.control;
		lastChooseCard = state.choose_card;
		lastPlayCards = state.play_cards;
		lastActivity = state.activity;

		ctx_ui_cards_right.clearRect(0,0,1500,800);
		ctx_ui_cards_right.beginPath();
		ctx_ui_cards_right.lineWidth="3";
		ctx_ui_cards_right.strokeStyle="white";
		ctx_ui_cards_right.rect(1310,350,180, 100);
		ctx_ui_cards_right.stroke();

		drawStateAttributes(state.control, ctx_ui_cards_right, "User: " + user, 1320, 330);
		drawStateAttributes(state.choose_card, ctx_ui_cards_right, "Choose Cards", 1320, 375, "\u2022 ");
		drawStateAttributes(state.play_cards, ctx_ui_cards_right, "Play Cards", 1320, 405, "\u2022 ");
		drawStateAttributes(state.activity, ctx_ui_cards_right, "Attack/Coward", 1320, 435, "\u2022 ");
	}

}

//Desc: Draws the oppents of the client, draws states, temp
//Pre: null
//Post: null
var drawOppentState = function(){

	let state = null;
	let user = null;
	Object.keys(Player.list).forEach(key =>{
		if(Player.list[key].id !== selfId){
			state = Player.list[key].state;
			user = Player.list[key].name;
		}
	});
	
	if(!selfId || !state)
		return;

		ctx_ui_cards_left.clearRect(0,0,1500,800);
		ctx_ui_cards_left.beginPath();
		ctx_ui_cards_left.lineWidth="3";
		ctx_ui_cards_left.strokeStyle="white";
		ctx_ui_cards_left.rect(10,350,180, 100);
		ctx_ui_cards_left.stroke();
		

		drawStateAttributes(state.control, ctx_ui_cards_left, "User: " + user, 20, 330);
		drawStateAttributes(state.choose_card, ctx_ui_cards_left, "Choose Cards", 20, 375, "\u2022 ");
		drawStateAttributes(state.play_cards, ctx_ui_cards_left, "Play Cards", 20, 405, "\u2022 ");
		drawStateAttributes(state.activity, ctx_ui_cards_left, "Attack/Coward", 20, 435, "\u2022 ");

}


var drawPlayerKeep = function(){
	
	if(!selfId)
		return;

	ctx_ui_player_keep.clearRect(0,0,1500,800);
	ctx_ui_player_keep.beginPath();
	ctx_ui_player_keep.lineWidth="4";
	ctx_ui_player_keep.strokeStyle="white";
	ctx_ui_player_keep.rect(200,400,550,200);
	ctx_ui_player_keep.stroke();

	ctx_ui_player_keep.fillStyle="white";
	ctx_ui_player_keep.fillText(Player.list[selfId].action, 220, 430, 475);

}

var drawEnemyKeep = function(){

	var opp = null;
	Object.keys(Player.list).forEach(key => {
		if(Player.list[key].id !== selfId){
			opp = Player.list[key];
		}
	});

	if(!selfId)
		return;
	if(opp !== null){
		ctx_ui_enemy_keep.clearRect(0,0,1500,800);
		ctx_ui_enemy_keep.beginPath();
		ctx_ui_enemy_keep.lineWidth="4";
		ctx_ui_enemy_keep.strokeStyle="blue";
		ctx_ui_enemy_keep.rect(750,200,550,200);
		ctx_ui_enemy_keep.stroke();

		ctx_ui_enemy_keep.fillStyle="white";
		ctx_ui_enemy_keep.fillText(opp.action, 770, 230, 475);
	}
}


/* Helpers */

var drawStateAttributes = function(attr, can, title, x, y, accent = ""){
	if(attr){
		can.fillStyle = 'white';
		can.fillText(accent + title, x, y);	
	}
	else{
		can.fillStyle = 'green';
		can.fillText(title, x, y);	
	}
}