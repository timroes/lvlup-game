const q = require('q'),
	server = require('../server'),
	socketio = require('socket.io');

import Question from './question';
import Player from './player';
import Screen from './screen';
import * as utils from '../utils';

const timeOverrun = 2; // in seconds
const highscoreLimit = 10;

const events = {
	reset: 'reset'
};

export default class Game {

	constructor() {
		this.io = socketio(server.server);
		this.initSocket();
		this.initScreen(this.io);
		this.questions = {};
		this.reset();
	}

	initScreen(io) {
		this.screen = new Screen(io);
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
						player.emitHighscore(this.highscore);
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

	addQuestions(questions) {
		if (Array.isArray(questions)) {
			questions.forEach(qes => {
				this.questions[utils.generateUUID()] = qes;
			});
		} else {
			throw new Error('Questions must be in form of an array.');
		}
	}

	setQuestion(id) {
		if (this.currentQuestion) {
			clearTimeout(this.currentQuestionTimeoutId);
		}

		this.allPlayers(player => player.currentAnswer = null);

		if (!this.questions[id]) {
			var err = new Error(`Cannot find question with id ${id}.`);
			err.name = 'InvalidIdError';
			throw err;
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
				exp = this.currentQuestion.expForAnswer(player.currentAnswer);
				player.lvlup(exp);
				player.emit('player:update', player.lvlInfos);
			}

			player.emit('solution', {
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

		if (this.currentQuestionTimeoutId) {
			clearTimeout(this.currentQuestionTimeoutId);
		}

		this.currentQuestion = null;

		let players = Object.keys(this.players).map((sessId) => {
			return this.players[sessId];
		});

		players.sort((a, b) => b.totalExp - a.totalExp);

		this.highscore = players.slice(0, highscoreLimit).map(player => {
			return {
				username: player.username,
				level: player.level,
				totalExp: player.totalExp
			};
		});

		this.screen.highscore = this.highscore;

		players.forEach((player, rank) => {
			player.rank = rank + 1;
			player.emitHighscore(this.highscore);
		});

	}

	reset() {
		if (this.currentQuestionTimeoutId) {
			clearTimeout(this.currentQuestionTimeoudId);
		}

		this.players = {};
		this.usernames = [];
		this.currentQuestion = null;
		this.highscore = null;
		this.screen.reset();

		this.io.sockets.emit(events.reset);
	}

	allPlayers(cb) {
		for (let id in this.players) {
			cb(this.players[id]);
		}
	}

}
