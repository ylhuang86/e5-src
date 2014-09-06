var helpers = require('./helpers.js');

exports.getAnnouncement=function(req,res){
	helpers.load_User_Data(function(data){
		
	
	});
}
exports.getUserInfo=function(req,res){

	helpers.send_success(res, { userInfo: userInfo });
}