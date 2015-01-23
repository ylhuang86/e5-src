var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var password = require('./Password.js');
var async = require('async');

var host = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : Connection.DEFAULT_PORT;

var db = new Db('Account',new Server(host,port,{auto_reconnect:true,poolSize:20},{w:1}));

// For creating a new database "Account", new collection "account", and a new data
async.waterfall([
	function()
	{
		db.collection("account",function(err,accounts)
			{
				if(err){console.log(err);return;}
				var account = {_id:"0110001",pass:password.encrypt('abc')};
				accounts.insert(account,{safe:true},function(err,inserted_doc)
					{
						if(err&&err.name=="MongoError"&&err.code==11000)
							{console.log("This account exists already.");return;}
						else if(err)
							{console.log("Something bad happened");console.log(err);return;}
					});
			});
	},
	function()
	{
		console.log("Finishing creating collection");
	}
	]);
