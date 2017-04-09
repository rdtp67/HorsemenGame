/* Helper funcitons */
checkRoomExist = function(pack, room){
	var isRoom = null;
	Object.keys(pack).forEach(key => {
		if(key == room){
			isRoom = key;
		}
	});

	return isRoom;
}

//Deck: Finds the client's oppenent in the room, ** This will need to be modified for different sized rooms
//Pre: room: room_id for the client, cur_id: id for the client
//Post: return oppent player id
 getOpp = function(room, cur_id){
	var player_list = [];
	Object.keys(Player.list).forEach(key => {
		if(Player.list[key].room_id === room){
			player_list.push(Player.list[key]);
		}
	});

	let opp_id = null;

	for(var i in player_list){
		if(player_list[i].id !== cur_id){
			opp_id = player_list[i].id;
		}
	}

	return opp_id
}

//Desc: Checks amount of players in room, alerts if room size is too large, passes information if ready to assign states to players
//Pre: list of players in current room, size of the players in the current room
//Post: bool ~ true: assign states, false: wait for more players
checkRoomSize = function(player_list, room_size){
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

//Desc: Get player list for all players in room
//Pre: list of players, room number
//Post: list of players in current room
getPlayersInRoom = function(list, room){
    let player_list = [];
	Object.keys(list).forEach(key => {
		if(list[key].room_id === room){
			player_list.push(list[key]);
		}
	});

    return player_list;
}