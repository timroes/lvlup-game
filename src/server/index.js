const express = require('express'),
	server = require('./server'),
	socketio = require('socket.io');

const Game = require('./model/game');

var api = require('./api');

const game = new Game();

// TODO: move api to api package
server.app.use('/api', api(game));
server.app.use('/admin/api', require('./api/admin')(game));

server.app.use('/admin', express.static(__dirname + '/admin'));
server.app.use(express.static(__dirname + '/client'));

server.server.listen(process.env.NODE_PORT || 3000);