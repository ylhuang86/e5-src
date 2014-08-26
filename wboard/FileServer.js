/* Upload - html */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);



app.configure(function(){
	app.use(express.bodyParser({uploadDir : './'}));
	app.use(express.static(__dirname,'./'));
});

app.get('/',function(req,res){
	res.sendfile("./frame.html");
});
app.get('/upload',function(req,res){
	res.sendfile("./upload.html");
});
app.get('/chat',function(req,res){
	res.sendfile("chat.html",{'root':'../tchat'});
});
app.get('/cookies',function(req,res){
	res.sendfile("cookies.js",{'root':'../tchat'});
});
app.get('/pdfjs',function(req,res){
	res.sendfile("pdfjs.js");
});
app.get('/pdfjs.worker.js',function(req,res){
	res.sendfile("pdf.worker.js");
});
/*
app.get('/upload.html',function(req,res){
	res.sendfile("./upload.html");
});
app.get('/a.html',function(req,res){
	res.sendfile("./a.html");
});
app.get('/d.html',function(req,res){
	res.sendfile("./d.html");
});
app.get('/style.css',function(req,res){
	res.sendfile("./style.css");
});
app.get('/drag.js',function(req,res){
	res.sendfile("./drag.js");
});
*/

/* Upload - upload File */
var fs = require('fs');
app.post('/fileUpload', function(req,res){
	var uploadedFile = req.files.file;
	//console.log(req.files);
	var tmpPath = uploadedFile.path;
	var targetPath = './'+uploadedFile.originalFilename;
	
	fs.rename(tmpPath, targetPath, function(err){
		if(err) throw err;
		
		fs.unlink(tmpPath, function(){
			//console.log('File Uploaded to '+targetPath+'-'+uploadedFile.size+'bytes');
			res.end();
		});
		
	});
});


/* Drawing Server */
io.on('connection', function(socket){
	socket.on('draw',function(record){
		//console.log("inininini");
		io.emit('showdraw',record);
	});
	socket.on('chat message', function(msg){
		console.log(msg);
		io.emit('chat message', msg);
    });
});

/* Memo - By Eggy - undone */
/*app.post('', function (req, res){
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
*/

http.listen(8800);


