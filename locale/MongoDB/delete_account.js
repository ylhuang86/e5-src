var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var host = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : Connection.DEFAULT_PORT;

var db = new Db('Account',new Server(host,port,{auto_reconnect:true,poolSize:20},{w:1}));
db.collection("account",function(err,accounts)
	{
		if(err)
		{
			console.error(err);
			return;
		}
		accounts.remove();
	});	