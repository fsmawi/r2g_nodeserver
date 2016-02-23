// app.js
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var port = 4200;
var main = module.exports.app = express();
var server = http.createServer(main);
var io = require('socket.io').listen(server);
var client2 = null;

main.use(bodyParser.urlencoded({
    extended: true
}));
main.use(bodyParser.json());
main.use(express.static(__dirname + '/bower_components'));
main.get('/', function(req, res, next) {
    console.log('index !');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    client2 = client;
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
    	console.log(data);
        client.emit('broad', data);
        client.broadcast.emit('broad', data); //brodcast all other clients
    });

});

main.post('/msg', function(req, res) {
    console.log(req.body);
    if (req.body.uuid != undefined && req.body.msgcount != undefined) {
        res.send('There are ' + req.body.msgcount + ' unread messages for user ' + req.body.uuid);
        io.emit('msgcount', req.body);
    }
    else {
        res.send('Nothings !');
    }
})

server.listen(port);