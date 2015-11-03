export default class NamespaceSocket {

	constructor(io, namespace) {
		this.sockets = io.of(`/${namespace}`);
		this.sockets.on('connection', (socket) => {});
	}

	onConnect(callback) {
		this.sockets.on('connection', callback);
	}

	emit(...args) {
		this.sockets.emit(...args);
	}

}