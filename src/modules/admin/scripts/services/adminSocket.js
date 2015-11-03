angular.module('lvlup.admin')
.factory('adminSocket', function(socketFactory) {
	// TODO: Remove ugly URL hack once https://github.com/socketio/socket.io-client/issues/812 is fixed
	var socket = io.connect(window.location.origin + '/admin');
	var adminSocket = socketFactory({
		ioSocket: socket,
		prefix: 'game:'
	});

	function bind(events) {
		adminSocket.forward(events);
	}

	return {
		bind: bind,
		socket: adminSocket
	};
});