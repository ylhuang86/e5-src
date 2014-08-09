/* Upload - html */
var express = require('express');

var app = express();
	app.configure(function(){
		app.use(express.bodyParser({uploadDir : './'}));
		app.use(express.static(__dirname,'./'));
	});
app.listen(8800);


app.get('/',function(req,res){
	
	// write html
	console.log("in /");
	res.sendfile("./upload.html");
});

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
			console.log('File Uploaded to '+targetPath+'-'+uploadedFile.size+'bytes');
			//res.sendfile("./show.html");
			res.end();
		});
		
	});
	//res.send('File upload is done! :)');
	//res.end();
});

app.get('/show',function(req,res){
	console.log("in /show");
	//req.method='get';
	//res.redirect("../show.html?filename="+req.query.filename);
	//res.render('titles', req.)
//	res.end();
});

