
Draw_Card = function(){
    var self = {
        draw:[],
    }

    self.getCardLogic = function(logic){

        //logic chars: int, c, d, p, w, &, |, (, )
        /*
            1. build array of chars
            2. create array of arrays grouping options

        */

        //Output: if only 1 option: choose option for player, if more than one option: provide player with multiple options to choose

        var l_array = [];
        //console.log(logic);
    
        l_array = [...logic];  


        var len = l_array.length - 1;

       // console.log(l_array, false, 0, len, [], "");
        var out = Draw_Card.buildLogic(l_array, false, 0, len, [], "");
        
        if(out.length === 0){
            console.log("Error ~ Draw card output 0");
        }
        
        return out;
        
    }

    return self;
}

//Purpose: comment needed badely. will do later. hopefully
Draw_Card.buildLogic = function(logic, par, start, end, output, cur){
    //console.log(logic[start] + " " +  par + " " +  start + " " +  end + " " +  output + " " + cur);
    if(logic[start] === "("){//1
        //console.log("1 " + logic[start] + " " + par + " " + (start+1) + " " + end + " out" +  output + " cur" + cur);
        par = true;
        return Draw_Card.buildLogic(logic, par, (start+1), end, output, "");
    }
    else if(logic[start] === ")")//2
    {
        //console.log("2 " + logic[start] + " " + par + " " + (start+1) + " " + end + " out" +  output + " cur" + cur);

        par = false;
        if(start === end){
            output.push(cur)
            return output;
        }
        else{
            output.push(cur)
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, "");
        }
    }
    else if(logic[start] === "&"){//3
            //console.log("3 " + logic[start] + " " + par + " " + (start+1) + " " + end + " out" +  output + " cur" + cur);
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, (cur+=logic[start]));
    }
    else if(logic[start] === "|"){//4
       // console.log("4 " + logic[start] + " " + par + " " + (start+1) + " " + end + " out" +  output + " cur" + cur);
        if(par === true){
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, (cur+=logic[start]));
        }
        if(cur === ""){
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, cur);
        }
        if(cur !== ""){
            output.push(cur)
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, "");
        }
    }
    else if(isFinite(logic[start]) == true){//5

        //console.log("5 " + logic[start] + " " + par + " " + (start+1) + " " + end + " out" +  output + " cur" + cur);

        return Draw_Card.buildLogic(logic, par, (start+1), end, output, (cur+=logic[start]));;

    }
    else{//6

      // console.log("6 " + logic[start] + " " + par + " " + start + " " + end + " out" +  output + " cur" + cur);

        if(start === end){
            cur+=logic[start]
            output.push(cur)
            return (output);
        }
        else{
            return Draw_Card.buildLogic(logic, par, (start+1), end, output, (cur+=logic[start]));
        }

        
    }
}

Draw_Card.getDrawCardAmounts = function(logic){
    var output = {
        Death:0,
        Conquest:0,
        War:0,
        Plauge:0,
    }

    var str = ""
    str = logic[0];

    for(var i = 0; i < str.length; i++){
        let k = i-1;
        switch(str[i]){
            case 'd':
                output.Death+=str[k];
                break;
            case 'c':
                output.Conquest+=str[k];
                break;
            case 'w':
                output.War+=str[k];
                break;
            case 'p':
                output.Plauge+=str[k];
                break;
            default:
                break;
        }
    }

    return output;
}