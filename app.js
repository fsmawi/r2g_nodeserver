// app.js
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var port = 4200;
var main = module.exports.app = express();
var server = http.createServer(main);
var io = require('socket.io').listen(server);

main.use(bodyParser.urlencoded({
    extended: true
}));
main.use(bodyParser.json());
main.use(express.static(__dirname + '/bower_components'));
main.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected !');
    client.on('join', function(data) {
        console.log(data + 'joined');
        client.join(data);
    });

    client.on("disconnect",function(){
        console.log(client.room + 'gone away !');
        client.leave(client.room);
    })

});

main.post('/msg', function(req, res) {
    if (req.body.uuid != undefined && req.body.msgcount != undefined) {
        res.send('OK');
        io.to(req.body.uuid).emit('msgcount', req.body);
    }
    else {
        res.send('Nothings !');
    }
})

server.listen(port);