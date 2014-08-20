window.Lang = 
{
	support_lang:["en_us","zh_tw"],
	lang_setting:"en_us",

	setLang:function(language)
	{
		language=language.toLowerCase();
		for(i in this.support_lang)
		{
			if(this.support_lang[i]==language)
			{
				this.lang_setting = language;
				return;
			}
		}
	},

	getWord:function(word)
	{
		try
		{
			return Lang.words[word][Lang.lang_setting];
		}
		catch(e)
		{
			return word;
		}
	}
}