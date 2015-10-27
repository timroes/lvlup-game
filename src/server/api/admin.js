const router = require('express').Router();

module.exports = (game) => {

	router.get('/questions', (req, res) => {
		res.json(game.questions);
	});

	router.post('/question', (req, res) => {
		game.setQuestion(req.body.question);
		res.send();
	});

	router.post('/endQuestion', (req, res) => {
		game.endQuestion();
		res.send();
	});

	router.post('/endGame', (req, res) => {
		game.endGame();
		res.send();
	});

	router.post('/game/reset', (req, res) => {
		game.reset();
		res.send();
	});

	return router;

};