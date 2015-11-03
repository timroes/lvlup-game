import NamespaceSocket from '../socket/namespaceSocket';

const events = {
	reset: 'reset',
	playerJoined: 'player:join',
	players: 'players'
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

}