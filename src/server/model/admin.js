import NamespaceSocket from '../socket/namespaceSocket';

const events = {
	answer: 'answer',
	reset: 'reset',
	playerJoined: 'player:join',
	players: 'players',
	question: 'question'
};

export default class Admin extends NamespaceSocket {

	constructor(io) {
		super(io, 'admin');
	}

	playerJoined(player) {
		this.emit(events.playerJoined, player.infosForAdmin);
	}

	updatePlayers(players) {
		this.emit(events.players, Object.keys(players).map(sessId => players[sessId].infosForAdmin));
	}

	reset() {
		this.emit(events.reset);
	}

	currentQuestion(question) {
		this.emit(events.question, question.adminJson);
	}

	answerStatistics(statistics) {
		this.emit(events.answer, statistics);
	}

}
