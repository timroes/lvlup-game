const events = {
	highscore: 'highscore'
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
				this.emit(events.highscore, this._highscore);
			}
		});
	}

	emit() {
		this.sockets.emit.apply(this.sockets, arguments);
	}

	set highscore(hs) {
		this._highscore = hs;
		this.emit(events.highscore, hs);
	}

}