var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var password = require('./Password.js');
var express = require('express');
var app = express();
var async = require('async');
var fs = require('fs');
var path = require('path');

var host = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_HOST']!=null ? process.env['MONGO_NODE_DRIVER_HOST'] : Connection.DEFAULT_PORT;

var db = new Db('Account',new Server(host,port,{auto_reconnect:true,poolSize:20},{w:1}));

var user,pass;

app.use(express.bodyParser());
app.get('/',function(req,res){serve_static_file('./login.html',res);});
app.post('/login',function(req,res){authentication(req.body.account,req.body.password,res);});

app.listen(8080);

function authentication(user,pass,res)
{
	db.collection("account",function(err,accounts)
		{
			if(err)
			{
				console.error(err);
				return;
			}
			accounts.find({_id:user}).toArray(function(err,results)
				{
					if(err)
					{
						console.log("Something bad happened");
						return;
					}
					if(results[0]!=undefined&&password.decrypt(results[0].pass)==pass)
						res.end("Your identity is a secret, don't tell anyone.");
					else if(results[0]!=undefined&&password.decrypt(results[0].pass)!=pass)
						res.end("You already had an account, but your password was wrong.");
					else
					{
						createAccount(user,pass);
						res.end("You are a stranger, nice to meet you, and I'll create an account for you.");
					}
				});
		});		
}

function createAccount(user,pass)
{
	db.collection("account",function(err,accounts)
		{
			if(err)
			{
				console.error(err);
				return false;
			}
			var account = {_id:user,pass:password.encrypt(pass)};
			accounts.insert(account,{safe:true},function(err,inserted_doc)
				{
					if(err&&err.name=="MongoError"&&err.code==11000)
					{
						console.log("This data exists already");
						return false;
					}
					else if(err)
					{
						console.log("Something bad happened");
						return false;
					}
					console.log("Register successfully");
				});
		});
}

function serve_static_file(file, res) {
    var rs = fs.createReadStream(file);
    rs.on(
        'error',
        function (e) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }
    );


    var ct = content_type_for_file(file);
    res.writeHead(200, { "Content-Type" : ct });

    rs.pipe(res);
}


function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'text/plain';
    }
}