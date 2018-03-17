var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 9000;


//http://core.unicorngo.io/v1/genetics/generate?image=3ewtydgshjxcn54300068ew789soixjchvghsds
app.post('/v1/genetics/generate', function(req, res) {
    var rand = Math.floor(Math.random()*100000000).toString(16);
    // console.log('receiving data ...');
    console.log('gen0:',req.body);
    res.send({"param1":123,"chain":rand,"param2":"qweqwe"});
});
app.post('/v1/genetics/pair', function(req, res) {
    var rand = Math.floor(Math.random()*100000000).toString(16);
    // console.log('receiving data ...');
    console.log('hybr:',req.body);
    res.send({"param1":123,"chain":rand,"param2":"qweqwe"});
});


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);