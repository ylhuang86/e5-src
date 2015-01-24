var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var async = require('async');

var host = process.env['MONGO_NODE_DRIVEN_HOST']!=null?process.env['MONGO_NODE_DRIVEN_HOST']:'localhost';
var port = process.env['MONGO_NODE_DRIVEN_HOST']!=null?process.env['MONGO_NODE_DRIVEN_HOST']:Connection.DEFAULT_PORT;

var db = new Db('Score',new Server(host,port,{auto_reconnect:true,poolSize:20},{w:1}));

app.use(express.bodyParser());

app.get('/pages/home',function(req,res){generatehtml(req,res,'loginpage.html');});
//generate homepage
app.get('/pages/teacher/courselist',function(req,res){generatehtml(req,res,'courselist.html');});
//generate courselist html
app.get('/pages/teacher/editcourse',function(req,res){generatehtml(req,res,'editscore.html');});
//generate editscore html
app.get('/pages/teacher/setgradingpolicy',function (req,res){generatehtml(req,res,'setgradingpolicy.html');});
//generate setgradingpolicy html


app.post('/pages/test',function (req,res){test(req,res);});


//test
function test(req,res){
	
	res.writeHead(200,{"Content-Type":"text/html"});
	res.end(req.body);
}
//end test

//generate file html
function generatehtml(req,res,name){
	var page = req.params.page_name;
    fs.readFile(
        name,
        function (err, contents) {
            if (err) {
                send_failure(res, 500, err);
                return;
            }

            contents = contents.toString('utf8');
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );



}

app.listen(8080);