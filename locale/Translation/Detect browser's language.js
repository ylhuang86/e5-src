var lang = window.navigator.userLanguage || window.navigator.language ;		
	var relang=lang.toLowerCase();
	switch (relang){
		case "zh-cn":
		$("#tbody").load("minwt_zh-cn.html");
		break;
 
		case "zh-tw":
		$("#tbody").load("minwt_zh-tw.html");
		break;
 
                default:
		$("#tbody").load("minwt_zh-tw.html");
	}			