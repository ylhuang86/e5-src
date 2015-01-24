
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
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


// customize the account settings form //
if(getLang("language")=="zh_tw"){
	$('#account-form h1').text('個人中心');
	$('#account-form #sub1').text('在這裡設定您的帳戶');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('刪除');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('修改');

// setup the confirm window that displays when the user chooses to delete their account //
	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('刪除帳號');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('取消');
	$('.modal-confirm .submit').html('刪除');
	$('.modal-confirm .submit').addClass('btn-danger');
	//Label
	$('#name').text('真實姓名');
	$('#email').text('電子信箱');
	$('#dep').text('學系');
	$('#user').text('帳號');
	$('#pass').text('密碼');	
}else{
//en_us
	$('#account-form h1').text('Account Settings');
	$('#account-form #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //
	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');
	//Label
	$('#name').text('Name');
	$('#email').text('Email');
	$('#dep').text('Department');
	$('#pass').text('Password');
	$('#user').text('Username');
}

})//document.ready
	

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