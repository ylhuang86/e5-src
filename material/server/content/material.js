$(function(){
	var tmpl,   // Main template HTML
	tdata = {};  // JSON data object that feeds the template
	
	// Initialise page
    var initPage = function() {
		// get material name.
        parts = window.location.href.split("/");
        var material_name = parts[5];
		// Load the HTML template
        $.get("/templates/material.html", function(d){
            tmpl = d;
        });
		// Retrieve the server data and then initialise the page  
        $.getJSON("/v1/materials/" + material_name + ".json", function (d) {
            var mfile_d = massage_material(d);
            $.extend(tdata, mfile_d);
        });
		// When AJAX calls are complete parse the template 
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            var renderedPage = Mustache.to_html( tmpl, tdata );
            $("body").html( renderedPage );
        })    
    }();
});
function massage_material(d) {
    if (d.error != null) return d;
    var obj = { mfiles: [] ,Info:[]};

    var af = d.data.material_contents_data;

    for (var i = 0; i < af.mfiles.length; i++) {
        var url = af.short_name +"/"+ af.mfiles[i].filename;
		var desc=af.mfiles[i].filename;
		desc=desc.substring(0,desc.lastIndexOf("."));
        obj.mfiles.push({ url: url, desc: desc});
    }
	var IconURL=af.short_name +"/"+af.Icon;
	 obj.Info.push({IconURL:IconURL})
    return obj;
}