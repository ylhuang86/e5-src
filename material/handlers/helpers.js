var fs=require('fs'); 

exports.version = '0.1.0';


exports.make_error = function(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}


exports.send_success = function(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
	var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}


exports.send_failure = function(res, code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


exports.invalid_resource = function() {
    return exports.make_error("invalid_resource",
                              "the requested resource does not exist.");
}

exports.no_such_material = function() {
    return exports.make_error("no_such_material",
                              "The specified album does not exist");
}
//
exports.load_User_Data=function (callback){
	//[Discussion]temperately implemented in this way,it actually should be done by DB & cookie
	fs.readFile("./users/user.json",function(err,file){
		if(err)return;
		var userdata=JSON.parse(file);
		callback(userdata);
	});
}
//