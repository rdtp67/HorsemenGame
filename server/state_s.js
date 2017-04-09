State = function(){
    var self = {
        control:null,
        choose_card:null,
        play_cards:null,
        activity:null,
    }

    //Desc: Updates states of the client
    //Pre: control: true~currently has control of the game, choose_card: true~client has option to draw card, play_cards: true~clients turn to play cards, activity: true~clients turn to attack or coward
    //Post: null
    self.updateStates = function({control = false, choose_card = false, play_cards = false, activity = false} = {}){
            self.control = control;
            self.choose_card = choose_card;
            self.play_cards = play_cards;
            self.activity = activity;
    }

    return self;

}

//Desc: Controling funciton which signs initial states to players in a room if all players are present, will assign control to one player and set all other players to false
//Pre: list of players in the room, id of the room, amount of players allowed in room
//Post: null
State.assignStatesInitial = function(list, room, room_size){

	let player_list = [];
	Object.keys(list).forEach(key => {
		if(list[key].room_id === room && list[key].player_hero !== null){
			player_list.push(list[key]);
		}
	});

	if(checkRoomSize(player_list, room_size)){
        console.log("Assigning states in room: " + room);
        let controler = assignControlStates(player_list, room_size);
        Player.list[controler].powerCrystalModify(1);
    }

}


State.changeControl = function(list, cur_id, room){
    let player_list = [];
	Object.keys(list).forEach(key => {
		if(list[key].room_id === room){
			player_list.push(list[key]);
		}
	});

    for(var i in player_list){
        if(player_list[i].id !== cur_id){
            player_list[i].updateStates({control:true, choose_card:true});
            player_list[i].powerCrystalModify(1);
        }
    }
}

/* Helper functions */

//Desc: Checks amount of players in room, alerts if room size is too large, passes information if ready to assign states to players
//Pre: list of players in current room, size of the players in the current room
//Post: bool ~ true: assign states, false: wait for more players
var checkRoomSize = function(player_list, room_size){
    let readyToAssign = false;
	if(player_list.length > room_size){
		console.log("Error ~ too many players have joined game: " + room);
	}
	else if(player_list.length === room_size){
        readyToAssign = true;
        for(var i in player_list){
            player_list[i].updateAction("");
        }
	}
	else{
        for(var i in player_list){
            player_list[i].updateAction("Waiting for more players to join.");
        }
	}

    return readyToAssign;
}

//Desc: Assigns control to a random player in the room, and sets all other players to false in all states
//Pre: list of players in current room, size of the current room
//Post: null
var assignControlStates = function(player_list, room_size){
    let  controlPlayer = player_list[Math.floor(Math.random() * room_size)].id;    
    for(let i in player_list){
        if(player_list[i].id === controlPlayer){
            let states_info = {control:true, choose_card:true};
            player_list[i].updateStates(states_info);
        }
        else{
            player_list[i].updateStates();
        }
    }

    return controlPlayer;
}