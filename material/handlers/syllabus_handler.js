/*
*	Author: Shang-Yi Tsai 
*	About	: To help server handling syllabus request. 
*	Date	: 2014/08/28
*	
*/
var async = require('async');
var fs = require('fs');
exports.load_syllabus= function (req, res) {
	var url="syllabus/"+req.params.permanent_ID+"/"+req.params.syllabus_name;
	console.log(url);
	fs.readFile(url,function(err,file){
		//[Discussion] Should we check the type of syllabus file?
		if(err){
			
			res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + req.params.syllabus_name + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return; 
		}
		var rs = fs.createReadStream(file);
		rs.on(
            'error',
            function (e) {
                res.end();
            }
        );
		res.writeHead(200, { "Content-Type" : "application/pdf" });
        rs.pipe(res);
	});
};
