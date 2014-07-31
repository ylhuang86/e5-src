var name="Anonymous";
if(getCookie("name"))
	name=getCookie("name");
var socket = io();
$('#chat').submit(function(){
	socket.emit('chat message',"["+(new Date()).toLocaleTimeString()+"] "+name+" : "+$('#m').val());
	$('#m').val('');
	return false;
});
socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});

function cname(name)
{
	name=prompt("Please enter your name");
	write(name);
}
