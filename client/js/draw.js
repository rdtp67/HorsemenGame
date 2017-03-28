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