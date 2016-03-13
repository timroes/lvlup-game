angular.module('lvlup.screen')
.factory('screenSocket', function(socketFactory) {
	var socket = io.connect('/screen');
	return socketFactory({
		ioSocket: socket,
		// Set the prefix for socket events when forwarded as angular events
		prefix: 'screen:'
	});
});
