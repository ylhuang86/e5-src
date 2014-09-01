var helpers = require('./handlers/helpers.js');
var fs=require('fs');


load_User_Data=function (){
	//temperately implemented in this way
	fs.readFile("./users/user.json",function(err,file){
		if(err)return;
		var userdata=JSON.parse(file);
		console.log("In load_User_Data:"+userdata);
		return userdata;
	});
}
var v=load_User_Data();
console.log("Out of load_User_Data:"+v);
