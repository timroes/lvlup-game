var http = require('http');

for (var x = 1; x < 400; x++) {
	var data = JSON.stringify({
		name: 'Player ' + x
	});
	var req =  http.request({
		method: 'POST',
		host: 'localhost',
		port: 3000,
		path: '/api/login',
		headers: {
			'content-type': 'application/json',
			'content-length': data.length
		}
	});

	req.write(data);

	req.end();
}