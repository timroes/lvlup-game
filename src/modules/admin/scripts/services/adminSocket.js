angular.module('lvlup.admin')
.factory('adminSocket', function(socketFactory) {
	var socket = io.connect('/admin');
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
