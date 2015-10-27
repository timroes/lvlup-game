const http = require('http'),
	bodyParser = require('body-parser');

const app = require('express')();

app.use(bodyParser.json());

module.exports.app = app;
module.exports.server = http.Server(app);