import * as utils from '../utils';

var router = require('express').Router();

const errorStatus = {
	'INVALID_USERNAME': 400,
	'DUPLICATE_USERNAME': 409
};

module.exports = function(game) {

	router.post('/login', (req, res) => {

		game.addPlayer(req.body.name)
			.then((sessId) => {
				res.json({
					session: sessId
				});
			})
			.catch((reason) => {
				res.status(errorStatus[reason] || 500).json({
					error: reason
				});
			});

	});

	return router;
};