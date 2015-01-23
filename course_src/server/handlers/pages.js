
var helpers = require('./helpers.js'),
    fs = require('fs');


exports.version = "0.1.0";


exports.generate = function (req, res) {
    var page = req.params.page_name;
    var sub_page = req.params.sub_page;
	if(sub_page==undefined)sub_page=page;
    fs.readFile(
        '../public/templates/basic.html',
        function (err, contents) {
            if (err) {
				console.log("ERR");
                helpers.send_failure(res, 500, err);
                return;
            }
            contents = contents.toString('utf8');
            // replace page name, and then dump to output.
			//[Discussion]
            contents = contents.replace('{{PAGE_NAME}}', sub_page);
            contents = contents.replace('{{PAGE_NAME}}', page);
			//
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
};
