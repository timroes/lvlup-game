
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