$(function(){
	var tmpl,   // Main template HTML
	tdata = {};  // JSON data object that feeds the template
	
	// Initialise page
    var initPage = function() {
		// Load the HTML template
        $.get("/templates/course.html", function(d){
            tmpl = d;
        });
		// Retrieve the server data and then initialise the page  
		$.get("/getCourse",function(d){
			var data=massage_course(d);
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

function massage_course(d) {
    if (d.error != null) return d;
	var af = d.data.course_data;
	var obj = { course: [],user_name:af.user_name,identity:af.identity};
    for (var i = 0; i < af.TakenSubject.length; i++) {
        var url = af.TakenSubject[i];
		var desc= af.TakenSubject[i];
        obj.course.push({ url: url, desc: desc });
    }
	console.log(obj);
    return obj;
}