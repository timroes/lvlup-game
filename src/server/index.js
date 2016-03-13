import auth from './auth';
import Game from './model/game';

const express = require('express'),
	server = require('./server'),
	socketio = require('socket.io');

const modules = `${__dirname}/modules`;

const game = new Game();

server.app.use('/api', require('./api/client')(game));

auth('/admin', `${__dirname}/../htpasswd/admin.htpasswd`, 'lvlup Admin');
server.app.use('/admin/api', require('./api/admin')(game));
server.app.use('/admin', express.static(`${modules}/admin`));

server.app.use('/shared', express.static(`${modules}/shared`));

auth('/screen', `${__dirname}/../htpasswd/screen.htpasswd`, 'lvlup Screen');
server.app.use('/screen', express.static(`${modules}/screen`));

server.app.use(express.static(`${modules}/client`));

server.server.listen(process.env.NODE_PORT || 3000);
