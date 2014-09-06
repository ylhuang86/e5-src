$(function(){
 
    var tmpl,   // Main template HTML
    var tdata={};
 
    // Initialise page
    var initPage = function() {
        // Load the HTML template
		parts = window.location.href.split("/");
        var subject_name = parts[5];
        $.get("/templates/subject.html", function(d){
            tmpl = d;
        });
		var data={options:[]};
		data.options.push({name:subject_name});
		$.extend(tdata, data);
        // When AJAX calls are complete parse the template 
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            var renderedPage = Mustache.to_html( tmpl, tdata );
            $("body").html( renderedPage );
        });    
    }();
});

