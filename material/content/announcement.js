$(function(){
	var tmpl,   // Main template HTML
	tdata = {};  // JSON data object that feeds the template
	
	// Initialise page
    var initPage = function() {
		// get material name.
        parts = window.location.href.split("/");
        var PermanentID = parts[5];
		// Load the HTML template
        $.get("/templates/announcement.html", function(d){
            tmpl = d;
        });
		// Retrieve the server data and then initialise the page  
		$.get("/announcement/"+PermanentID,function(d){
			var data=massage_announce(d);
			$.extend(tdata,data);
		});
		// When AJAX calls are complete parse the template 
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            var renderedPage = Mustache.to_html( tmpl, tdata );
            $("body").html( renderedPage );
        })    
    }();
});

function massage_announce(d) {
    if (d.error != null) return d;
	var af = d.data.announce_data;
	var obj = { announce: [],user_name:af.user_name,identity:af.identity};
    for (var i = 0; i < af.announce.length; i++) {
        var url = af.short_name+"/"+ af.announce[i].name;
        obj.announce.push({ url: url, desc: af.announce[i].name });
    }
    return obj;
}