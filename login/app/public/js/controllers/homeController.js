function HomeController()
{
// bind event listeners to button clicks //
	var that = this;	
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

//	btn for lang
	$('#cht-btn').click(function(){
		document.cookie = "language=zh_tw;";	
		window.location.reload(false);
	});
	
	$('#eng-btn').click(function(){
		document.cookie = "language=en_us;";
		window.location.reload(false);	
	});
// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

// confirm account deletion //
	$('#account-form-btn1').click(function(){$('.modal-confirm').modal('show')});
	$('#account-form-btn3').click(function(){window.location.href = '/main'});

// handle account deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteAccount(); });

	this.deleteAccount = function()
	{
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/delete',
			type: 'POST',
			data: { id: $('#userId').val()},
			success: function(data){
				if(getLang("language")=="zh_tw")
					that.showLockedAlert('帳號刪除成功<br>重新導向首頁...');
				else	
					that.showLockedAlert('Your account has been deleted.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/home",
			type: "POST",
			data: {logout : true},
			success: function(data){
				if(getLang("language")=="zh_tw")
					that.showLockedAlert('成功登出!!<br>重新導向首頁...');
				else	
					that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		if(getLang("language")=="zh_tw")
			$('.modal-alert .modal-header h3').text('成功!');
		else
			$('.modal-alert .modal-header h3').text('Success!');
		
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 1000);		
	}
}

HomeController.prototype.onUpdateSuccess = function()
{

	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	if(getLang("language")=="zh_tw"){
		$('.modal-alert .modal-header h3').text('成功!');
		$('.modal-alert .modal-body p').html('帳號修改成功');
	}
	else{
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html('Your account has been updated.');
	}
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
