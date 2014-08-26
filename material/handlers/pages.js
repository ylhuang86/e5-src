
var helpers = require('./helpers.js'),
    fs = require('fs');


exports.version = "0.1.0";


exports.generate = function (req, res) {
	console.log("generate");
    var page = req.params.page_name;
	console.log(page);
    fs.readFile(
        'basic.html',
        function (err, contents) {
            if (err) {
				console.log("ohoh!");
                send_failure(res, 500, err);
                return;
            }

            contents = contents.toString('utf8');

            // replace page name, and then dump to output.
			//[Discussion]26,27
            contents = contents.replace('{{PAGE_NAME}}', page);
            contents = contents.replace('{{PAGE_NAME}}', page);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
};