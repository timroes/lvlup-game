const bodyParser = require('body-parser'),
	express = require('express'),
	socketio = require('socket.io');

const Game = require('./game');

var app = express();

var server = require('http').Server(app);

var api = require('./api');

var io = socketio(server);

const game = new Game(io);

app.use(bodyParser.json());

// TODO: move api to api package
app.use('/api', api(io, server));
app.use('/admin/api', require('./api/admin')(game));

app.use('/admin', express.static(__dirname + '/admin'));
app.use(express.static(__dirname + '/client'));

server.listen(process.env.NODE_PORT || 3000);