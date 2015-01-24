
$(document).ready(function(){
	
	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/main';
		},
		error : function(e){
		if(getLang("language")=="zh_tw")
		lv.showLoginError('登入失敗', '請確認您的帳號/密碼是否正確');
		else
            lv.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#user-tf').focus();
	
// login retrieval form via email //
	
	var ev = new EmailValidator();
	
	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				if(getLang("language")=="zh_tw")
					ev.showEmailAlert("<b> 格式錯誤!</b> 請輸入正確的Email!");
				else
					ev.showEmailAlert("<b> Error!</b> Please enter a valid email address");
					
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if(getLang("language")=="zh_tw")
				ev.showEmailSuccess("請到信箱檢查Email，並重設您的密碼");
			else
				ev.showEmailSuccess("Check your email on how to reset your password.");
		},
		error : function(){
			if(getLang("language")=="zh_tw")
			ev.showEmailAlert("休士頓，我們有麻煩了(請稍後在試)");
			else
			ev.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
	
})
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


if(getLang("language")=="zh_tw"){
	$('#heading').text('E6教學平台');
	$('.subheading').text('交通大學-數位學習平台');
	$('#labeluser').text('帳號');	
	$('#labelpass').text('密碼');	
	//$('#btn-login').text('登入');	
	$('#btn-login').html("<i id=\"btn-login2\" class=\"icon-lock icon-white\"></i>登入");	
	$('#forgot-password').text('哎呀,忘記密碼?');
	$('#create-account').text('我要申請新帳號');
	$('#remember-me').text('保持登入');
}