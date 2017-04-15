var mysql = require('mysql');
require('./deck_s.js');

//Possibly create pooling in the future to limit connecitons at one time
var myconn = mysql.createConnection({
    host:'198.71.227.92',
    user:'mav26',
    password:'koU0c!55',
    database:'rdtp67_Horsemen_TEST'
});

function getDeck(callback){
    myconn.connect(function(err){if(err){console.log(err.code);console.log(err.fatal);}});
    myconn.query('select * from run_card limit 1', function(err, rows, fields){
        if(!err){
            callback(null, rows);
        }
        else
        {
            console.log('Example failed');
        }
    });

}

getDeck(function(err, result){
    console.log("CB");
    if(!err){
        for(var i in result){
            console.log(result[i].run_id);
        }
    }
});


