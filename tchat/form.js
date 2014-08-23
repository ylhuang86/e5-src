var express = require('express');
var bodyParser = require('body-parser');
var fs=require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//app.use(bodyParser);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies
app.get('/', function (req, res) {
	res.sendfile("./index.html");
});
app.get('/cookies.js', function (req, res) {
	res.sendfile("./cookies.js");
});
app.get('/chat.html', function (req, res) {
	res.sendfile("./chat.html");
});
app.post('', function (req, res){
	//res.end('hello world');
	console.log(req.body.entry);
	var buf=new Buffer(req.body.entry.length+1);
	buf.write(req.body.entry);
	fs.open('./temp.txt','w',function(err,fd){
		if (err) {
			console.log("ERROR: " + err.code+ " (" + err.message + ")");
			return;
		}
		fs.write(fd,buf,0,req.body.entry.length,null,function(err, written, buffer){
			if (err) {
				console.log("ERROR: " + err.code+ " (" + err.message + ")");
				return;
			}
			fs.close(fd,function(){
				res.download('./temp.txt');
			});
		});
	});
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.emit('chat message', msg);
    
  });
});
http.listen(8800);
