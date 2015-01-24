var Base64 = require('./base64_node.js');
var Aes = require('./aes_node.js');
var a = new Aes();
var b = new Base64();
exports.encrypt = function(password)
{
	return a.encrypt(b.encode(password)+"Yeah~",'password',256);
}
exports.decrypt = function(password)
{
	var temp = a.decrypt(password,'password',256);
	temp = b.decode(temp.substring(0,temp.length-5));
	return temp;
}