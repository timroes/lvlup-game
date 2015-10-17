var router = require('express').Router();

module.exports = function() {

	router.get('/test', function(req, res) {
		console.log("hello world!!!");
		res.send();
	});

	return router;
};