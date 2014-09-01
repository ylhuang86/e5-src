fs = require('fs'),
load_User_Data=function (){
	//temperately implemented in this way
	fs.readFile("./users/user.json",function(err,file){
		if(err) {
		console.log("err");
		return;
		}
		var userdata=JSON.parse(file);
		console.log(userdata);
		return userdata;
	});
}
load_User_Data();