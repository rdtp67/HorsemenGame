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
