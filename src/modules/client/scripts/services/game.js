angular.module('lvlup.client')
.factory('game', function($q, $http, $location, localStorageService, gameSocket) {

	var SESSION_KEY = 'session';

	function socketAuth() {
		gameSocket.emit('authenticate', { session: getSession() }, function(sess) {
			if (!sess) {
				localStorageService.remove(SESSION_KEY);
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
		gameSocket.forward(['player_info', 'question'], scope);
	}

	function setAnswer(id) {
		gameSocket.emit('answer', { id: id });
	}

	socketAuth();

	return {
		getSession: getSession,
		login: login,
		connect: connect,
		setAnswer: setAnswer
	};

});