var helpers = require('./helpers.js'),
	fs = require('fs'),
	async =require('async');
/*
exports.getAnnouncement=function(req,res){
//[Improvement]Currently load single announcement.It should be rewritten into multi-file version.
	helpers.load_User_Data(function(data){
		
	
	});
	
	
	helpers.send_success(res, { userInfo: userInfo });
}*/
exports.listAnnouncement=function(req,res){
	console.log("*");
	var sPermanentID=req.params.permanent_ID;
	console.log("sPermanentID:"+sPermanentID);
	helpers.load_User_Data(function(data){
		var user_name=data.UserInfo.Name;
		//[Discussion]The value of identity should be provided by server according to subject_detail/subjectdata.json
		var identity="Student";
		var sCurrentID=data.Academic.TakenSubject[sPermanentID.toString('utf8')][0];
		console.log("sCurrentID:"+sCurrentID);
		loadAnnouncementList(sPermanentID,sCurrentID,function (err, announce) {
			if (err) {
				helpers.send_failure(res, 500, err);
				return;
			}
			var announce_data={user_name:user_name,identity:identity,announce:announce,short_name:"/"+sPermanentID+"/"+sCurrentID};
			console.log(announce_data);
			helpers.send_success(res, { announce_data: announce_data });
		});
		
	});
}


function loadAnnouncementList(PermanentID,CurrentID,callback){
	fs.readdir(
        "announcement/"+PermanentID+"/"+CurrentID,
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
                        "announcement/"+PermanentID+"/"+CurrentID+"/"+element,
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