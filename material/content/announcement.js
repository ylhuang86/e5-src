$(function(){
	var tmpl,   // Main template HTML
	tdata = {};  // JSON data object that feeds the template
	
	// Initialise page
    var initPage = function() {
		// get material name.
        parts = window.location.href.split("/");
        var material_name = parts[5];
		// Load the HTML template
        $.get("/templates/announcement.html", function(d){
            tmpl = d;
        });
		// Retrieve the server data and then initialise the page  
		$.get("/announcement.json",function(d){
			
		});
		// When AJAX calls are complete parse the template 
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            var renderedPage = Mustache.to_html( tmpl, tdata );
            $("body").html( renderedPage );
        })    
    }();
});