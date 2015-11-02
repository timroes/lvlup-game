const events = {
	highscore: 'highscore',
	reset: 'reset',
	statistics: 'statistics'
};

export default class Screen {

	constructor(io) {
		this.initSocket(io);
	}

	initSocket(io) {
		this.sockets = io.of('/screen');
		this.sockets.on('connection', (socket) => {
			// TODO: do some kind of authentication here (perhaps in a base class)
			// TODO: do we need to send the screen something when connected

			if (this._highscore) {
				this._emit(events.highscore, this._highscore);
			}
		});
	}

	_emit() {
		this.sockets.emit.apply(this.sockets, arguments);
	}

	reset() {
		this._highscore = null;
		this._emit(events.reset);
	}

	set highscore(hs) {
		this._highscore = hs;
		this._emit(events.highscore, hs);
	}

	set answerStatistics(statistics) {
		this._emit(events.statistics, statistics);
	}

}