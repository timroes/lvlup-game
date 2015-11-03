import NamespaceSocket from '../socket/namespaceSocket';

const events = {
	highscore: 'highscore',
	reset: 'reset',
	statistics: 'statistics'
};

export default class Screen extends NamespaceSocket {

	constructor(io) {
		super(io, 'screen');
		this.initSocket();
	}

	initSocket() {
		this.sockets.on('connection', (socket) => {
			// TODO: do some kind of authentication here (perhaps in a base class)
			// TODO: do we need to send the screen something when connected

			if (this._highscore) {
				this.emit(events.highscore, this._highscore);
			}
		});
	}

	reset() {
		this._highscore = null;
		this.emit(events.reset);
	}

	set highscore(hs) {
		this._highscore = hs;
		this.emit(events.highscore, hs);
	}

	set answerStatistics(statistics) {
		this.emit(events.statistics, statistics);
	}

}