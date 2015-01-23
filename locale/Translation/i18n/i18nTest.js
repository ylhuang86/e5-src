var express = require('express');
var app = express();
var i18n = require('./i18n-node-master/i18n.js');

i18n.configure(
{
	locales:['en','zh'],
	directory:__dirname+'/locales'
});

app.use(i18n.init);
app.get('/',function(req,res)
	{
		i18n.setLocale('zh');
		// i18n.setLocale('en');
		// console.log(i18n.getLocale());
		res.send('<body>res: '+i18n.__('Hello')+' req: '+i18n.__('Hello')+'</body>');
	});
app.listen(8080);