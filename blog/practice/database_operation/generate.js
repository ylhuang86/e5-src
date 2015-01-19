var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    async = require('async');

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

    // 2. create collections for account
    function (db, cb) {
        console.log("\n** 2. create account collection.");
        db.createCollection("account", cb);
    },

    // 3. verify that creating a new collection with the same name
    function (acc_coll, cb) {
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
