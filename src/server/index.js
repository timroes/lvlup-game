var express = require('express');
var app = express();

var api = require('./api');

app.use('/api', api(app));
app.use(express.static(__dirname + '/public'));

app.listen(process.env.NODE_PORT || 3000);