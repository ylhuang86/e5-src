var password = require("./Password.js");
var temp = 'abc';
console.log("Before encoding : "+temp);
var t = password.encrypt(temp);
console.log("After encoding : "+t);
console.log("After decoding : "+password.decrypt(t));