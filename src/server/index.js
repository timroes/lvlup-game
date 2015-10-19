var bodyParser = require('body-parser'),
	express = require('express');

var app = express();

var server = require('http').Server(app);

var api = require('./api');

app.use(bodyParser.json());

app.use('/api', api(server));
app.use(express.static(__dirname + '/client'));

server.listen(process.env.NODE_PORT || 3000);