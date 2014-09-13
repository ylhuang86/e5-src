var helpers = require('./helpers.js');
var async = require('async');

exports.list_subject_list=function(req,res){
	helpers.load_User_Data(function(data){
		var takensubject=Object.keys(data.Academic.TakenSubject);
		var subjects=[];
		async.forEach(
			takensubject,
			function (element, cb){
				subjects.push({ name: element });
				cb(null);
			},
			function (err) {
				if (err) {
					helpers.send_failure(res, 500, err);
					return;
				}
				helpers.send_success(res, { subjects: subjects });
			}
		);
	});
	
}