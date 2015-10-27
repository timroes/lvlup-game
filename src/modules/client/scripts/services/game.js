angular.module('lvlup.client')
.factory('game', function($q, $http, $location, localStorageService, gameSocket) {

	var SESSION_KEY = 'session';

	function socketAuth() {
		gameSocket.emit('authenticate', { session: getSession() }, function(sess) {
			if (!sess) {
				localStorageService.remove(SESSION_KEY);
				// TODO: forward to an error start page instead,
				// our session is not valid (anymore)
				$location.path('/');
			}
		});
	}

	function getSession(name) {
		return localStorageService.get(SESSION_KEY);
	}

	function login(name) {
		return $http.post('/api/login', {
			name: name
		})
		.then(function(response) {
			localStorageService.set(SESSION_KEY, response.data.session);
			socketAuth();
		});
	}

	function connect(scope) {
		gameSocket.forward([
			'answer-chosen',
			'connect',
			'disconnect',
			'player',
			'player:update',
			'question'
		], scope);
	}

	function setAnswer(id) {
		var defer = $q.defer();
		gameSocket.emit('answer', { id: id }, function(result) {
			if (result) {
				defer.resolve();
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	// If we connect to the socket, we try to authenticate to it with our session id
	gameSocket.on('connect', socketAuth);

	gameSocket.on('disconnect', function() {
		// TODO: do we need to do anything when disconnected from socket in the service?
		console.log('onDisconnect');
	});

	return {
		getSession: getSession,
		login: login,
		connect: connect,
		setAnswer: setAnswer
	};

});