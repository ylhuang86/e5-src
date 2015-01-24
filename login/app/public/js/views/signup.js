
$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	if(getLang("language")=="zh_tw"){
	$('#account-form h1').text('申請帳號');
	$('#account-form #sub1').text('填入您的詳細資料吧');
	$('#account-form #sub2').text('建立新的帳號&密碼');
	$('#account-form-btn1').html('取消');
	$('#account-form-btn2').html('確認');
	$('#account-form-btn2').addClass('btn-primary');
// setup the alert that displays when an account is successfully created //
	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('成功!');
	$('.modal-alert .modal-body p').html('帳號建立成功</br>點選 確認 回到登入畫面.');		
	
	$('#name').text('真實姓名');
	$('#email').text('電子信箱');
	$('#dep').text('學系');
	$('#user').text('帳號');
	$('#pass').text('密碼');
	
	}else{
	$('#account-form h1').text('Signup');
	$('#account-form #sub1').text('Please tell us a little about yourself');
	$('#account-form #sub2').text('Choose your username & password');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
// setup the alert that displays when an account is successfully created //
	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been created.</br>ClickOK to return to the login page.');
	$('#name').text('Name');
	$('#email').text('Email');
	$('#dep').text('Department');
	$('#pass').text('Password');
	$('#user').text('Username');
	}
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