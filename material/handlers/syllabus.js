var helpers = require('./helpers.js'),
    async = require('async'),
    fs = require('fs');
	
exports.list_all = function (req, res) {
    load_subject_list(function (err, materials) {
        if (err) {
            helpers.send_failure(res, 500, err);
            return;
        }
        helpers.send_success(res, { subjects: subjects });
    });
};


function load_subject_list(callback) {

	.Academic.




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