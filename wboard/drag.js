/* Just two Lazy function */
function $id(id){
	return document.getElementById(id);
}

function Output(msg){
	var m = $id("messages");
	m.innerHTML = msg + m.innerHTML;
}

// Drop Style
	// file drag hover
	function FileDragHover(e){
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

	// file selection
	function FileSelectionHandler(e){
		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		var formData = new FormData();
		
		for(var i=0; i<files.length;i++){
			ParseFile(files[i]);
			formData.append('file',files[i]);
		}
		UploadFile(formData,files);
	}



function ParseFile(file){
	Output(
		"<p>File info: <strong>" + file.name +
		"</strong> type: <strong>" + file.type +
		"</strong> size: <strong>" + file.size +
		"</strong> bytes</p>"
	); 
}

function UploadFile(file,tofind){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", $id("upload").action);
	//xhr.setRequestHeader("X_FILENAME", file.name);
	xhr.onload = function(){
		if(xhr.status === 200){
			console.log('all done: '+xhr.status);
			console.log(tofind[0].name);
			show(tofind[0]);		
		}else{
			console.log('no~~:');
		}
	};
	xhr.send(file);	
}

function show(file){
	//var xhr = new XMLHttpRequest();
	//xhr.open("GET","/show",true );
	//xhr.onload = function(){
	//	if(xhr.status === 200){
	//		console.log('all done: '+xhr.status);
	//	}else{
	//		console.log('no~~:');
	//	}
	//};
	//xhr.send();
	location.assign("./showex.html?filename="+file.name);
}


function Init(){
	var fileselect = $id("fileselect"),
		filedrag = $id("filedrag"),
		submitbutton = $id("submitbutton");
	
	// file select - one of the method this page offers
	fileselect.addEventListener("change", FileSelectionHandler, false);
	
	// file drop - one of the method this page offers
		// check if XHR2 is available
		var xhr = new XMLHttpRequest();
		if(xhr.upload){
			// file drop event
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectionHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}
}

/* Check id the File API is available */
(function(){
if(window.File && window.FileList && window.FileReader){
	Init();
}

})();
