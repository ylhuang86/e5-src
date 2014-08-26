/*1.1
add new setLang function

*/
/*version 1.0
this is design for replace your words
it means when your web or blog need to service to different language,
you don't have to do the same copy action for your web,
just link this in your code and set the words liberty
like:
window.WL_LANG.words={
		welcome:{
			en_us:'Welcome',
			zh_tw:'歡迎您',
			zh_cn:'欢迎你'
		},
		hi:{
			en_us:'Hi',
			zh_tw:'嗨',
			zh_cn:'嗨'
		}
}
wolke lin
wolkesau@gmail.com

*/

window.WL_LANG={
	support_lang:['en_us','zh_tw','ja_jp'],
	lang_setting:'en_us',
	
	checkLang:function(){
		/*check the lang setting*/
		var lang;
		if ($.browser.msie){      		
			lang= navigator.systemLanguage.replace("-","_")				
	    }
		else{// if( $.browser.mozilla) 
			lang=navigator.language.replace("-","_").toLowerCase();
		}
		this.setLang(lang);
	},
	setLang:function(lang){
		lang=lang.toLowerCase()
		for (i in this.support_lang){
			if (this.support_lang[i] == lang){
				this.lang_setting=lang;
				return
			}
		}
	},
	//send language setting to server with JQuery
	setServerLang:function(){
		return;
		$.ajax({
			url:'setlang',
			type: "POST",
			data: {'lang':WL_Lang.lang_setting},
			dataType: "json",
			success: function(d){
			}
		})
	},
	GL:function(p){
		try{
			return WL_LANG.words[p][WL_LANG.lang_setting]
		}catch(e){
			return p;
		}
	},
	changeLang:function(obj,lang){
	
	if(lang!=null){
		for (var i in this.support_lang){
			if(lang==this.support_lang[i])
			{this.lang_setting=lang}
		}
	}
		
	$(obj).each(function(){
		if ($(this).attr('wl_lang')==null){	
			$(this).attr('wl_lang',$(this).text());
		}
		
		$(this).html(WL_LANG.GL($(this).attr('wl_lang')));
		
	})
}
}
window.WL_LANG.checkLang();
