var helpers = require('./helpers.js'),
    async = require('async'),
    fs = require('fs'),
	mhelper=require('./material_helper');
	
exports.version = "0.1.0";

exports.list_all = function (req, res) {
    load_material_list(function (err, materials) {
        if (err) {
            helpers.send_failure(res, 500, err);
            return;
        }
        helpers.send_success(res, { materials: materials });
    });
};
exports.material_by_name = function (req, res) {
	console.log("material_by_name");
    // get the GET params
    var getp = req.query;
    var page_num = getp.page ? getp.page : 0;
    var page_size = getp.page_size ? getp.page_size : 1000;

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /materials/material_name.json
    var material_name = req.params.material_name;
    load_material(
        material_name,
        page_num,
        page_size,
        function (err, material_contents) {
            if (err && err.error == "no_such_material") {
                helpers.send_failure(res, 404, err);
            }  else if (err) {
                helpers.send_failure(res, 500, err);
            } else {
                helpers.send_success(res, { material_contents_data: material_contents });
            }
        }
    );
};
function load_material_list(callback) {
    // we will just assume that any directory in our 'materials'
    // subfolder is an material.
    fs.readdir(
        "materials",
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
                        "materials/" + element,
                        function (err, stats) {
                            if (err) {
                                cb(helpers.make_error("file_error",
                                                      JSON.stringify(err)));
                                return;
                            }
                            if (stats.isDirectory()) {
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
};
function load_material(material_name, page, page_size, callback){
	mhelper.getSubjectList(material_name, page, page_size, callback);

}



/*
function load_material(material_name, page, page_size, callback) {
	//console.log("load_material");
	var access_material;
	fs.readFile(
		"./users/user.json",
		function(err,contents){
			if(err){console.log(err);return;}
			var tmp=material_name.toString('utf8');
			contents=JSON.parse(contents);
			access_material=contents[tmp];
			//console.log(tmp);
			var only_files = [];
			
			var path = "materials/" + material_name + "/"+access_material;	
			
			//console.log(path);
			fs.readdir(
				path,
				function (err, files) {
					if (err) {
						if (err.code == "ENOENT") {
							callback(helpers.no_such_material());
						} 
						else {
							callback(helpers.make_error("file_error",JSON.stringify(err)));
						}
						return;
					}
					//console.log("OK");
					async.forEach(
						files,
						function (element, cb) {
							console.log(path + element);
							fs.stat(
								path +"/"+element,
								function (err, stats) {
									//console.log(stats.isFile());
									if (err) {
										cb(helpers.make_error("file_error",JSON.stringify(err)));
										return;
									}
									if (stats.isFile()) {
									//console.log("*");
										var obj = { filename: element,desc: element };
										only_files.push(obj);
									}
									cb(null);
								}                    
							);
						},
						function (err) {
							if (err) {
								callback(err);
							} 
							else {
								var ps = page_size;
								var mfiles = only_files.splice(page * ps, ps);
								var obj = { short_name: material_name,mfiles: mfiles };
								callback(null, obj);
							}
						}
					);
				}
			
			);
            

            
		}
    );
	
};*/
//get_access_material:
//It return the folder depends on the user json-file in /users,thought I wonder it's necessity... 
//[improve]It should not be implemented like this.
/*function get_access_material(material_name){
	fs.readFile(
		"/users/user.json",
		function(err,contents){
			if(err){
				return {material_name:"not_access"};
			}
			return contents.material_name.toString('utf8');}
	);
}

console.log("access_material: "+access_material);

*/