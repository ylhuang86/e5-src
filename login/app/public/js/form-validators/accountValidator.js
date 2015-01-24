function AccountValidator(){

// build array maps of the form inputs & control groups //

	this.formFields = [$('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf')];
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateName = function(s)
	{
		return s.length >= 3;
	}
	
	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed their password, return ok
		if ($('#userId').val() && s===''){
			return true;
		}	else{
			return s.length >= 6;
		}
	}
	
	this.validateEmail = function(e)
	{
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
	}
	
	this.showErrors = function(a)
	{
		if(getLang("language")=="zh_tw")		
			$('.modal-form-errors .modal-body p').text('請修正這些錯誤:');
		else			
			$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[1].addClass('error');
	if(getLang("language")=="zh_tw")		
		this.showErrors(['此Email已經被使用過了']);
	else			
		this.showErrors(['That email address is already in use.']);
}

AccountValidator.prototype.showInvalidUserName = function()
{
	this.controlGroups[2].addClass('error');
	if(getLang("language")=="zh_tw")		
		this.showErrors(['此帳號已經被註冊過了']);
	else			
		this.showErrors(['That username is already in use.']);
}

AccountValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); 
		if(getLang("language")=="zh_tw")		
			e.push('請輸入姓名');
		else		
			e.push('Please Enter Your Name');
	}
	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); 
		if(getLang("language")=="zh_tw")		
			e.push('請輸入正確Email');
		else		
			e.push('Please Enter A Valid Email');
	}
	if (this.validateName(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		if(getLang("language")=="zh_tw")		
			e.push('請輸入帳號');
		else
			e.push('Please Choose A Username');
	}
	if (this.validatePassword(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		if(getLang("language")=="zh_tw")		
			e.push('密碼必須大於6位數');
		else
			e.push('Password Should Be At Least 6 Characters');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
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