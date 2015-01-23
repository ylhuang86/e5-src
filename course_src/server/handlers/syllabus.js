var helpers = require('./helpers.js');

exports.load_syllabus=function(req, res,cb){
	//[CAUTION]Error handling is suspended.
	helpers.load_User_Data(function(userdata){
		var permanent_ID=req.params.permanent_ID;
		var currentID=userdata.Academic.TakenSubject[permanent_ID.toString('utf8')][0];
		var url="../public/syllabus/"+permanent_ID+"/"+currentID+".pdf";
		url=url.toString('utf8');
		cb(url,res);
	});
}