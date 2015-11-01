angular.module('lvlup.client')
.factory('gameSocket', function(socketFactory) {
	return socketFactory({
		// Set the prefix for socket events when forwarded as angular events
		prefix: 'game:'
	});
});