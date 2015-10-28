	const q = require('q'),
	server = require('../server'),
	socketio = require('socket.io');

import Question from './question';
import Player from './player';
import * as utils from '../utils';

const timeOverrun = 2; // in seconds

const states = {
	waiting: Symbol("waiting"),
	question: Symbol("question")
};

export default class Game {

	constructor() {
		this.io = socketio(server.server);
		this.state = states.waiting;
		this.players = {};
		this.usernames = [];
		this.questions = require('../demo-questions');
		this.currentQuestion = null;
		this.highscore = null;
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
					socket.emit('player', player.infos);
					if (this.highscore) {
						socket.emit('highscore', this.highscore);
					}
					if (this.currentQuestion) {
						socket.emit('question', this.currentQuestion.clientJson, this.currentQuestion.timeRemaining);
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
				} else {
					callback(false);
				}

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
			clearTimeout(this.currentQuestionTimeoutId);
		}

		this.allPlayers(player => player.currentAnswer = null);

		if (!this.questions[id]) {
			throw new Error(`Cannot find question with id ${id}.`);
		}

		let question = Question.parse(this.questions[id]);

		let remainingTime = question.start();
		this.io.sockets.emit('question', question.clientJson, remainingTime);
		// End the current question 2 seconds after it should actually end (to compensate bad network, etc.)
		this.currentQuestionTimeoutId = setTimeout(this.endQuestion.bind(this), remainingTime + timeOverrun * 1000);

		this.currentQuestion = question;
	}

	endQuestion() {
		if (!this.currentQuestion) return;

		// TODO: Send out end question event

		if (this.currentQuestionTimeoutId) {
			clearTimeout(this.currentQuestionTimeoutId);
		}

		for (let id in this.players) {
			let player = this.players[id];
			let exp = null;
			if (player.currentAnswer) {
				// player.lvlup(player.currentAnswer.id === this.currentQuestion.correctId ? winExp : loseExp);
				exp = this.currentQuestion.expForAnswer(player.currentAnswer);
				player.lvlup(exp);
				player.socket.emit('player:update', player.lvlInfos);
				console.log("send out solution to player");
			}
			player.socket.emit('solution', {
				solved: exp !== null && exp > 0,
				correctAnswer: this.currentQuestion.correctAnswer
			});

			player.currentAnswer = null;
		}

		this.currentQuestion = null;
	}

	/**
	 * Instantly end the current game. This will just abort the current question (if any running).
	 */
	endGame() {
		// TODO: This should somehow really END this game, no other methods allowed
		// TODO: cancel running endQuestion timeout
		this.currentQuestion = null;

		let players = Object.keys(this.players).map((sessId) => {
			return this.players[sessId];
		});

		players.sort((a, b) => b.totalExp - a.totalExp);

		console.log(players);

		this.highscore = players.map(player => {
			return {
				username: player.username,
				level: player.level,
				totalExp: player.totalExp
			};
		});

		this.io.sockets.emit('highscore', this.highscore);
		// TODO: notify each winner individually
	}

	reset() {
		// TODO: reset the whole game
	}

	allPlayers(cb) {
		for (let id in this.players) {
			cb(this.players[id]);
		}
	}

}
