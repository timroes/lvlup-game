/**
 * A wrapper around socket.io sockets. This will offer failsafe methods, that won't crash
 * if there is currently no socket connected. You can extend this class to offer objects having
 * a socket bound to them, but won't fail if not.
 */
export default class SafeSocket {

	constructor() {
		this._socket = null;
	}

	set socket(s) {
		this._socket = s;
	}

	emit() {
		if (this._socket) {
			this._socket.emit.apply(this._socket, arguments);
		}
	}

}