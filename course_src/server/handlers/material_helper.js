var async = require('async');
var fs = require('fs');
var helpers=require('./helpers.js');
//method : Get info of user's subject name according to the identity info.
//detail : pass the user's accessible subject's permanent ID to this function,and get material_contents!
exports.getSubjectList=function(material_name, page, page_size, callback)
{
	var Icon;
	helpers.load_User_Data(function(userdata){
		async.waterfall([
			function(callback){
				//Find out accessible material direct
				access_material=userdata.Academic.TakenSubject[material_name.toString('utf8')][0];
				var path = "../public/materials/" + material_name + "/"+access_material;
				callback(null,path);
			},
			//use parameter path to read direct
			function(path,callback){
				fs.readdir(
					path,
				function(err,files) {
					var only_files=[];
					async.forEach(
						files,
						function (element, cb) {
							fs.stat(
								path +"/"+element,
								function (err, stats) {
									if (err) {
										cb(helpers.make_error("file_error",JSON.stringify(err)));
										return;
									}
									if (stats.isFile()) {
										if(element!="Icon.jpeg"&&element!="Icon.jpg"){
											var obj = { filename: element,desc: element };
											only_files.push(obj);
										}
										else{
											Icon=element;
										}
									}
									cb(null);
								}                    
							);
						},
						function (err) {
							if (err) {callback(err);} 
							else {
								var ps = page_size;
								var mfiles = only_files.splice(page * ps, ps);
								var obj = { short_name:material_name+"/"+access_material,mfiles: mfiles,Icon:Icon};
								callback(null, obj);
							}
						}
					);
				});}],
				function(err, material_contents){
					if (err) {
						if (err.code == "ENOENT") {
							callback(helpers.no_such_material(),null);
						} 
						else {
							callback(helpers.make_error("file_error",JSON.stringify(err)));
						}
						return;
					}
					callback(err, material_contents);
				}
		);
	});
}
