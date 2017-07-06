
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
					adminPageDiv.style.display = 'inline-block';
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

  