var Tran = {};
Tran.setLanguage = function(language)
{
	if(language=='chinese')
		return 0;
	else if(language=='english')
		return 1;
	else if(language=='japanese')
		return 2;
}
Tran.getSchool = function(language)
{
	switch(language)
	{
		case 0:
			return '學校';
		case 1:
			return 'School';
		case 2:
			return '学校';
	}
}
Tran.getName = function(language)
{
	switch(language)
	{
		case 0:
			return '名字';
		case 1:
			return 'Name';
		case 2:
			return '名前';
	}
}
Tran.getBook = function(language)
{
	switch(language)
	{
		case 0:
			return '書';
		case 1:
			return 'Book';
		case 2:
			return '本';
	}
}