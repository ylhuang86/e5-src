var async = require('async');
var fs = require('fs');
var helpers=require('./helpers.js');
exports.showCourse= function (req, res){
	helpers.load_User_Data(function(userdata){
				var course_data={};
				//Find out accessible material direct
				TakenSubject=Object.keys(userdata.Academic.TakenSubject);
				course_data.user_name=userdata.UserInfo.Name;
				course_data.identity=userdata.UserInfo.Identity;
				course_data.TakenSubject=TakenSubject;
				//It's useless for now.
				for(index=0;index<TakenSubject.length;index++){
					var temp=[];
					temp=userdata.Academic.TakenSubject[TakenSubject[index].toString('utf8')];
					course_data[TakenSubject[index].toString('utf8')]=temp;
				}
				helpers.send_success(res, { course_data: course_data });
			}
	);
	
	
	
	/*`
	if (err && err.error == "no_such_material") {
                helpers.send_failure(res, 404, err);
            }  else if (err) {
                helpers.send_failure(res, 500, err);
            } else {
				helpers.send_success(res, { course_data: course_data });
            }*/
	//res.end("finish");
}