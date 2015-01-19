var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    async = require('async');
    target = require('./data.js');


var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var db = new Db('Student', 
                new Server(host, port, 
                           { auto_reconnect: true,
                             poolSize: 20}),
                { w: 1 });

var account;

async.waterfall([

    // 1. open database connection
    function (cb) {
        console.log("\n** 1. open db");
        db.open(cb);
    },

    // 2. add information
    function (db, cb) {
        console.log("hahahahaha");
        db.collection("account", cb);
    },
    
    function (acc_coll, cb){
        account = acc_coll;
        var docs = target.docs;
        
        console.log("\n** 2. add account.");
        account.insert(docs, { safe: true }, cb);
    },

    // 5. check the results
    function (results, cb) {
        console.log("appended info: ");
        console.log(results);
        
        account.find().toArray(cb);
    },
    
    function (all_info, cb) {
        console.log("Stored info: ");
        for (var i = 0; i < all_info.length; i++) {
            console.log("Id: " + all_info[i]._id
                        + " ,pwd = " + all_info[i].password);
        }
        cb(null);
    }
],

// waterfall cleanup function
function (err, results) {
    if (err) {
        console.log("Aw, there was an error: ");
        console.log(err);
    } else {
        console.log("All operations completed without error.");
    }

    db.close();
});
