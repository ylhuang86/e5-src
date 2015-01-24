var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var CT = require('./modules/department-list');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var io 	= require('../public/wboard/node_modules/socket.io')(http);

module.exports = function(app) {
// main login page //
app.configure(function(){
	//app.use(express.bodyParser({uploadDir : './'}));
	app.use(express.bodyParser({uploadDir : './app/public/wboard'}));
	app.use(express.static(__dirname,'./'));
	//app.use(express.static(__dirname + '/app/public'));
});

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/main');
				}	else{
					res.render('login');
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }else{
				res.render('home', {			
				countries : CT,
				udata : req.session.user
				});
	    }
	});
	
	app.post('/home', function(req, res){
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				department 	: req.param('department'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	
				else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			department : req.param('department')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});


// get Main
	app.get('/main', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }else{
			res.sendfile("./app/public/intro.html");
		}
		/*
		else{
			res.render('main', {
				
				udata : req.session.user
			});
	    }*/
	});
	app.post('/main', function(req, res){
		if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});	

//Wboard
app.get('/wboard',function(req,res){
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }else{
			res.sendfile("./app/public/nav_wboard.html");
		}	
});
/*
app.get('/wboard/socket.io.js',function(req,res){	
	res.sendfile("app/public/tchat/node_modules/socket.io/node_modules/socket.io-client/socket.io.js");
});
*/
app.get('/wboard/upload',function(req,res){
	res.sendfile("./app/public/wboard/upload.html");
});
app.get('/wboard/chat',function(req,res){
	res.sendfile("./app/public/tchat/chat.html");
});
/*app.get('/wboard/cookies',function(req,res){
	res.sendfile("cookies.js",{'root':'./app/public/tchat'});
});

app.get('/socket.io/socket.io.js',function(req,res){
	res.sendfile("./app/public/tchat/node_modules/socket.io/node_modules/socket.io-client/socket.io.js");
});
*/

app.get('/wboard/pdfjs',function(req,res){
	res.sendfile("./app/public/wboard/pdfjs.js");
});
app.get('/wboard/pdfjs.worker.js',function(req,res){
	res.sendfile("./app/public/wboard/pdf.worker.js");
});

/* Upload - upload File */
var fs = require('fs');
app.post('/fileUpload', function(req,res){
	var uploadedFile = req.files.file;
	//console.log(req.files);
	var tmpPath = uploadedFile.path;
	var targetPath = './app/public/wboard/'+uploadedFile.originalFilename;	
	fs.rename(tmpPath, targetPath, function(err){
		if(err) throw err;
		fs.unlink(tmpPath, function(){
			//console.log('File Uploaded to '+targetPath+'-'+uploadedFile.size+'bytes');
			res.end();
		});		
	});
});

io.on('connection', function(socket){
	console.log("Open connection IO SOCKET!!!!!!!!!!!!");
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
app.post('/wboard/memo', function (req, res){
	//res.end('hello world');
	//console.log(req.body.fileContent);
	var content = req.body.fileContent;
	var buf=new Buffer(content.length+1);
	buf.write(req.body.fileContent);
	fs.open('./app/public/wboard/temp.txt','w',function(err,fd){
		if (err) {
			console.log("ERROR: " + err.code+ " (" + err.message + ")");
			return;
		}
		fs.write(fd,buf,0,content.length,null,function(err, written, buffer){
			if (err) {
				console.log("ERROR: " + err.code+ " (" + err.message + ")");
				return;
			}
			fs.close(fd,function(){
				res.download('./app/public/wboard/temp.txt');
			});
		});
	});
});



//
//material
//

/*
var path = require('path'),
    material_hdlr = require('./handlers/materials.js'),
	subject_hdlr =require('./handlers/subjects.js'),
	syllabus_hdlr=require('./handlers/syllabus.js'),
	announcement_hdlr=require('./handlers/announcement.js'),
    page_hdlr = require('./handlers/pages.js'),
    helpers = require('./handlers/helpers.js');

app.get('/v1/materials.json', material_hdlr.list_all);
app.get('/v1/materials/:material_name.json', material_hdlr.material_by_name);
//app.get('/subjects.json', subject_hdlr.list_subject_list);
//app.get('/announcement.json', announcement_hdlr.getAnnouncement);
app.get('/pages/:page_name',function (req, res) {
	page_hdlr.generate(req, res);
	});
app.get('/pages/:page_name/:sub_page',function (req, res) {
	page_hdlr.generate(req, res);
	});
app.get('/content/:filename', function (req, res) {
    serve_static_file('content/' + req.params.filename, res);
});
app.get('/materials/:permanent_ID/:current_ID/:filename', function (req, res) {
	var url="materials/"+req.params.permanent_ID+"/"+req.params.current_ID+"/"+req.params.filename;
    serve_static_file(url,res);
});


app.get('/syllabus/:permanent_ID',function (req, res) {
	syllabus_hdlr.load_syllabus(req,res,serve_static_file);
});
//Called by announcement_hdlr.getAnnouncement,return a object with single property 
//which contains all announce in the curentID folder. 
app.get('/announcement/:permanent_ID',function (req, res) {
	announcement_hdlr.listAnnouncement(req, res);
});
app.get('/templates/:template_name', function (req, res) {
    serve_static_file("templates/" + req.params.template_name, res);
});
app.get('/announce/:permanent_ID/:current_ID/:filename',function(req,res){
	announcement_hdlr.showAnnouncement(req,res);
});

function serve_static_file(file, res) {
    fs.exists(file, function (exists) {
        if (!exists) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }

        var rs = fs.createReadStream(file);
        rs.on(
            'error',
            function (e) {
                res.end();
            }
        );
        var ct = content_type_for_file(file);
        res.writeHead(200, { "Content-Type" : ct });
        rs.pipe(res);
    });
}
function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return 'text/html';
        case '.js': return 'text/javascript';
        case '.css': return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
		case '.pdf': return 'application/pdf';
        default: return 'text/plain';
    }
}


*/

app.get('/logout',function(req,res){
	res.clearCookie('user');
	res.clearCookie('pass');
	req.session.destroy(function(e){ res.send('ok', 200); });	
});

//404	
app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
