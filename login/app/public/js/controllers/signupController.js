
function SignupController()
{
// redirect to homepage when cancel button is clicked //
	$('#account-form-btn1').click(function(){ window.location.href = '/';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
	$('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
	
	$('#cht-btn').click(function(){
		document.cookie = "language=zh_tw;";	
		window.location.reload(false);
	});
	
	$('#eng-btn').click(function(){
		document.cookie = "language=en_us;";
		window.location.reload(false);	
	});
}