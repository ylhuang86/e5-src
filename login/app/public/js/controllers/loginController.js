
function LoginController()
{
// bind event listeners to button clicks //
	
	$('#login-form #forgot-password').click(function(){ $('#get-credentials').modal('show');});
	
// automatically toggle focus between the email modal window and the login form //

    $('#get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('#get-credentials').on('hidden', function(){ $('#user-tf').focus(); });
	
	$('#cht-btn').click(function(){
		document.cookie = "language=zh_tw;";	
		window.location.reload(false);
	});
	
	$('#eng-btn').click(function(){
		document.cookie = "language=en_us;";
		window.location.reload(false);	
	});
}