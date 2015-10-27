const q = require('q'),
	server = require('./server'),
	socketio = require('socket.io');

import Player from './player';
import * as utils from './utils';

const states = {
	waiting: Symbol("waiting"),
	question: Symbol("question")
};

const timePerQuestion = 30; // in seconds
const timeOverrun = 2; // in seconds

export default class Game {

	constructor() {
		this.io = socketio(server.server);
		this.state = states.waiting;
		this.players = {};
		this.usernames = [];
		this.questions = require('./questions');
		this.currentQuestion = null;
		this.initSocket();
	}

	initSocket() {
		this.io.on('connection', (socket) => {

			// TODO: Use two channels one for authenticated users one for pre authentication

			socket.on('authenticate', (data, callback) => {
				// TODO: don't store the player object just a key, to retrieve the player
				let player = this.players[data.session];
				callback(player && player.sessionId);
				if (player) {
					socket.player = player;
					player.socket = socket;
					console.log(player.infos);
					socket.emit('player', player.infos);
					if (this.currentQuestion) {
						socket.emit('question', this.currentQuestion.json, this.currentQuestion.endTime - Date.now());
					}
					if (player.currentAnswer) {
						socket.emit('answer-chosen', player.currentAnswer);
					}
				}
			});

			socket.on('answer', (data, callback) => {
				console.log("Answer given: ", data);
				if (
					this.currentQuestion // there must be a question
					&& this.currentQuestion.endTime + (timeOverrun * 1000) >= Date.now() // it must still run
					&& !socket.player.currentAnswer // the user must not have answered it before
				) {
					socket.player.currentAnswer = data;
					callback(true);
				}

				callback(false);
			});

		});
	}

	addPlayer(username) {
		if (typeof username !== 'string' || username.length < 3) {
			return q.reject('INVALID_USERNAME');
		}
		if (this.usernames.indexOf(username.toLowerCase()) >= 0) {
			return q.reject('DUPLICATE_USERNAME');
		}

		// store the username in the list of all usernames so no other players
		// can use that name
		this.usernames.push(username.toLowerCase());

		do {
			// Find a free session id for that player
			var sessionId = utils.generateUUID();
		} while(this.players.hasOwnProperty(sessionId));

		this.players[sessionId] = new Player(sessionId, username);

		return q.when(sessionId);
	}

	setQuestion(id) {
		if (this.currentQuestion) {
			clearTimeout(this.currentQuestion.timeout);
		}

		let question = this.questions[id];
		// Transform the object to the version, the clients should get
		let answers = [question.answer, ...question.wrongAnswers].map((a) => { return { id: utils.generateUUID(), answer: a }; });
		let correctId = answers[0].id;
		utils.shuffle(answers);
		const questionForClients = {
			type: question.type,
			question: question.question,
			answers: answers,
			exp: question.exp
		};

		let endTime = Date.now() + timePerQuestion * 1000;
		this.io.sockets.emit('question', questionForClients, timePerQuestion * 1000);
		// End the current question 2 seconds after it should actually end (to
		// compensate bad network, etc.)
		let timeout = setTimeout(this.endQuestion.bind(this), (timePerQuestion + timeOverrun) * 1000);

		this.currentQuestion = {
			question: question,
			timeout: timeout,
			endTime: endTime,
			correctId: correctId,
			json: questionForClients,
			exp: question.exp
		};
	}

	endQuestion() {
		if (!this.currentQuestion) return;
		console.log("end current question");
		if (this.currentQuestion.timeout) {
			clearTimeout(this.currentQuestion.timeout);
		}
		let winExp = this.currentQuestion.exp;
		let loseExp = -Math.ceil(this.currentQuestion.exp * 0.5);

		for (let id in this.players) {
			let player = this.players[id];
			player.lvlup(player.currentAnswer.id === this.currentQuestion.correctId ? winExp : loseExp);
			// TODO: send correct or wrong answers
			player.socket.emit('player:update', player.lvlInfos);
			player.currentAnswer = null;
		}

		this.currentQuestion = null;
	}

}
