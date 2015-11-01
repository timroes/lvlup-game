angular.module('lvlup.screen')
.factory('screenSocket', function(socketFactory) {
	// TODO: Remove ugly URL hack once https://github.com/socketio/socket.io-client/issues/812 is fixed
	var socket = io.connect(window.location.origin + '/screen');
	return socketFactory({
		ioSocket: socket,
		// Set the prefix for socket events when forwarded as angular events
		prefix: 'screen:'
	});
});