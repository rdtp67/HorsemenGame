function adminEffectSelect(){
    var effect = document.getElementById("adminSelectEffect").value;
    var i1 = document.getElementById("adminInput1");
    var i2 = document.getElementById("adminInput2");
    var i3 = document.getElementById("adminInput3");
    var i4 = document.getElementById("adminInput4");

    i1.innerHTML = "";
    i2.innerHTML = "";
    i3.innerHTML = "";
    i4.innerHTML = "";

    if(effect == "draw"){
        i1.innerHTML = "Draw Logic (varchar(80))";
    }
    else if(effect == "free_attack"){
        i1.innerHTML = "Damage Amount (tinyint)";
        i2.innerHTML = "Ignore Defense (tinyint(1))"
    }
    else if(effect == "health"){
        i1.innerHTML = "Health Add (tinyint)";
        i2.innerHTML = "Health Above Max (tinyint(1))";
    }
    else if(effect == "power_crystal"){
        i1.innerHTML = "PC Add (tinyint)";
    }
    else if(effect == "stat"){
        i1.innerHTML = "Stat Inc (tinyint)";
        i2.innerHTML = "Turn Len (tinyint)";
        i3.innerHTML = "Perm (tinyint(1))";
        i4.innerHTML = "Type (tinyint)";
    }
    else if(effect == "stat_type_to_value"){
        i1.innerHTML = "Amount (tinyint)";
        i2.innerHTML = "Type Code (tinyint)";
    }
    else{

    }
}

function adminPushCards(deck){
    console.log(deck);
    var cardList = document.getElementById("adminAddCard");

    Object.keys(deck).forEach(key => {
      let card = document.createElement("option");
      card.value = deck[key].id;
      card.text = deck[key].name;
      cardList.appendChild(card);
    });
}
