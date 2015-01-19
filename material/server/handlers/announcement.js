var helpers = require('./helpers.js'),
	fs = require('fs'),
	async =require('async');

exports.listAnnouncement=function(req,res){
	var sPermanentID=req.params.permanent_ID;
	helpers.load_User_Data(function(data){
		var user_name=data.UserInfo.Name;
		//[Discussion]The value of identity should be provided by server according to subject_detail/subjectdata.json
		//				cause TA is also a student in other subject.
		var identity=data.UserInfo.Identity;
		var sCurrentID=data.Academic.TakenSubject[sPermanentID.toString('utf8')][0];
		loadAnnouncementList(sPermanentID,sCurrentID,function (err, announce) {
			if (err) {
				helpers.send_failure(res, 500, err);
				return;
			}
			var announce_data={user_name:user_name,identity:identity,announce:announce,short_name:sPermanentID+"/"+sCurrentID};
			helpers.send_success(res, { announce_data: announce_data });
		});
		
	});
}

exports.showAnnouncement=function(req,res){
	helpers.load_User_Data(function(data){
		var identity=data.UserInfo.Identity;
		var subject=req.params.permanent_ID+"/"+req.params.current_ID;
		
		//Default value false
		var permission=false;
		loadAnnouncementContent(req,function(err,content){
			//[Discussion]Should be rewritten into function , which send a request to server to check if the user 
			//				has permission to this subject
			if(identity=="Teacher"||identity=="TA")permission=true;
			//
			fs.readFile(
			"../public/templates/showAnnounceContent.html",function(err,file){
				if(err) file="Error";
				file=file.toString('utf8');
				content=content.toString('utf8');
				file=file.replace('{{content}}',content);
				file=file.replace('{{permission}}',permission);
				file=file.replace('{{subject}}',subject);
				file=file.replace();
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(file);
			});
		});
	});
}
exports.createAnnounce=function(req,res){
	var theTime=new date();
	var month=theTime.getMonth(),
		date=theTime.getDate(),
		hour=theTime.getHours(),
		min=theTime.getMinutes(),
		sec=theTime.getSeconds();
	month=beautification(month);
	date=beautification(date);
	hour=beautification(hour);
	min=beautification(min);
	sec=beautification(sec);
	var fileName=""+theTime.getFullYear()+month+date+hour+min+sec;
	
	var url="../public/announce/"+req.params.permanent_ID+"/"+req.params.current_ID+"/"+fileName;
	fs.writeFile(url,req.body.content);
	res.end("Save");
};
function beautification(item){
		if (item<10) {item = "0" + item}; 
		return item;
}
function loadAnnouncementContent(req,callback){
	var url="../public/announce/"+req.params.permanent_ID+"/"+req.params.current_ID+"/"+req.params.filename;
	fs.readFile(url,function(err,file){
		if(err) file="Err";
		callback(err,file);
	});
}
function loadAnnouncementList(PermanentID,CurrentID,callback){
	fs.readdir(
        "../public/announce/"+PermanentID+"/"+CurrentID,
        function (err, files) {
            if (err) {
                callback(helpers.make_error("file_error", JSON.stringify(err)));
                return;
            }
		var only_dirs = [];
            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        "../public/announce/"+PermanentID+"/"+CurrentID+"/"+element,
                        function (err, stats) {
                            if (err) {
                                cb(helpers.make_error("file_error",
                                                      JSON.stringify(err)));
                                return;
                            }
                            if (stats.isFile()) {
                                only_dirs.push({ name: element });
                            }
                            cb(null);
                        }                    
                    );
                },
                function (err) {
                    callback(err, err ? null : only_dirs);
                }
            );
        }
    );
}