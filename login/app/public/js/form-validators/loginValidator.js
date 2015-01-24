
function LoginValidator(){

// bind a simple alert window to this controller to display any errors //

	this.loginErrors = $('.modal-alert');
	this.loginErrors.modal({ show : false, keyboard : true, backdrop : true });

	this.showLoginError = function(t, m)
	{
		$('.modal-alert .modal-header h3').text(t);
		$('.modal-alert .modal-body p').text(m);
		this.loginErrors.modal('show');
	}

}

LoginValidator.prototype.validateForm = function()
{
	if ($('#user-tf').val() == ''){
		if(getLang("language")=="zh_tw")
			this.showLoginError('哎呀!', '帳號不可以空白喔');
		else
			this.showLoginError('Whoops!', 'Please enter a valid username');
		return false;
	}	else if ($('#pass-tf').val() == ''){
		if(getLang("language")=="zh_tw")
			this.showLoginError('哎呀!', '密碼不可以空白喔');
		else
			this.showLoginError('Whoops!', 'Please enter a valid password');
		return false;
	}	else{
		return true;
	}
}
function getLang(key) { 
//ex:language=zh-tw;
	if( document.cookie.length==0 ) 
		return false; 
	var i=document.cookie.search(key+'='); 
	if( i==-1 ) 
		return false; 
	i+=key.length+1; 
	var j=document.cookie.indexOf(';', i); 
	if( j==-1 ) 
		j=document.cookie.length; 
	return document.cookie.slice(i,j); 
}	