var async = require('async');
var fs = require('fs');
//method : Get info of user's subject name according to the identity info.
//detail : pass the user's accessible subject's permanent ID to this function,and get material_contents!
exports.getSubjectList=function(material_name, page, page_size, callback)
{
	//use waterfall to implement it
	
	async.waterfall([
		//Step1. Read the user info from usersample.json	
		function(callback){	
			//err & contents is passed to next function
			//It looks weird cause I didn't see any err passed to next function.[Discussion]
			//Maybe the err was passed to callback directly.
			fs.readFile("./users/user.json",callback);
		},
		//Step2. Get contents
		function(contents,callback){
			contents=JSON.parse(contents);
			//Find out accessible material direct
			access_material=contents.Academic.TakenSubject[material_name.toString('utf8')][0];
			//
			var path = "materials/" + material_name + "/"+access_material;
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
								var obj = { filename: element,desc: element };
								only_files.push(obj);
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
						var obj = { short_name:material_name+"/"+access_material,mfiles: mfiles };
						console.log(obj.short_name);
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
}
