var router = require('express').Router();
var socketio = require('socket.io');

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

module.exports = function(server) {

	var users = {};
	var usernames = [];

	var io = socketio(server);

	io.on('connection', function(socket) {

		socket.on('authenticate', function(data, callback) {
			socket.player = users[data.session];
			callback(socket.player);
			if (socket.player) {
				socket.emit('player_info', socket.player);
			}
		});

	});

	router.post('/login', function(req, res) {
		var body = req.body;

		if (body.name.length < 3) {
			return res.status(400).json({
				error: "USERNAME_TOO_SHORT"
			});
		}

		if (usernames.indexOf(body.name.toLowerCase()) >= 0) {
			return res.status(409).json({
				error: "DUPLICATE_USERNAME"
			});
		}

		do {
			var sessionId = generateUUID();
		} while(users.hasOwnProperty(sessionId));

		usernames.push(body.name.toLowerCase());
		users[sessionId] = {
			name: body.name,
			level: 1,
			exp: 0
		};

		console.log("User %s joined", body.name);

		res.json({
			session: sessionId
		});
	});

	return router;
};