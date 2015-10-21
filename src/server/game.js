const utils = require('./utils');

const states = {
	waiting: Symbol("waiting"),
	question: Symbol("question")
};

const timePerQuestion = 30; // in seconds

class Game {

	constructor(io) {
		this.io = io;
		this.state = states.waiting;
		this.players = {};
		this.questions = require('./questions');
		this.currentQuestion = null;
		this.currentTimeout = null;
	}

	setQuestion(id) {
		clearTimeout(this.currentTimeout);
		this.currentQuestion = this.questions[id];
		// Transform the object to the version, the clients should get
		let answers = [this.currentQuestion.answer, ...this.currentQuestion.wrongAnswers];
		utils.shuffle(answers);
		const question = {
			type: this.currentQuestion.type,
			question: this.currentQuestion.question,
			answers: answers,
			exp: this.currentQuestion.exp
		};
		this.io.sockets.emit('question', question, timePerQuestion * 1000);
		// End the current question 2 seconds after it should actually end (to
		// compensate bad network, etc.)
		this.currentTimeout = setTimeout(this.endQuestion, (timePerQuestion + 2) * 1000);
	}

	endQuestion() {
		// TODO: send correct or wrong answers
		console.log("end current question");
	}

}

module.exports = Game;