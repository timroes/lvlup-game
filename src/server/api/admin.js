const router = require('express').Router();

module.exports = (game) => {

	router.get('/questions', (req, res) => {
		res.json(game.questions);
	});

	router.put('/questions', (req, res) => {
		try {
			game.addQuestions(req.body);
			res.sendStatus(201);
		} catch (e) {
			res.status(500).send(e.message);
		}
	});

	router.post('/question', (req, res) => {
		try {
			game.setQuestion(req.body.question);
			res.send();
		} catch(e) {
			if (e.name === 'InvalidIdError') {
				res.status(400).send(e.message);
			} else {
				throw e;
			}
		}
	});

	router.post('/endQuestion', (req, res) => {
		game.endQuestion();
		res.send();
	});

	router.post('/game/end', (req, res) => {
		game.endGame();
		res.send();
	});

	router.post('/game/reset', (req, res) => {
		game.reset();
		res.send();
	});

	return router;

};