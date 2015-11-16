import auth from 'http-auth';

const inProduction = process.env.NODE_ENV === 'production';

// TODO: refactor to use files not in git
const basicAdmin = auth.basic({
	realm: 'lvlup',
	file: `${__dirname}/admin.htpasswd`
});

const basicScreen = auth.basic({
	realm: 'lvlup Screen',
	file: `${__dirname}/screen.htpasswd`
});

const express = require('express'),
	server = require('./server'),
	socketio = require('socket.io');

const Game = require('./model/game');

const modules = `${__dirname}/modules`;

const game = new Game();

// TODO: move api to api package
server.app.use('/api', require('./api/client')(game));

if (inProduction) {
	// Only request basic auth in production
	server.app.use('/admin', auth.connect(basicAdmin));
}
server.app.use('/admin/api', require('./api/admin')(game));
server.app.use('/admin', express.static(`${modules}/admin`));

server.app.use('/shared', express.static(`${modules}/shared`));

if (inProduction) {
	// Only request basic auth in production
	server.app.use('/screen', auth.connect(basicScreen));
}
server.app.use('/screen', express.static(`${modules}/screen`));

server.app.use(express.static(`${modules}/client`));

server.server.listen(process.env.NODE_PORT || 3000);