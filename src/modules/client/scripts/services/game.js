angular.module('lvlup.client')
.factory('game', function($q, $http, $location, localStorageService, gameSocket) {

	var SESSION_KEY = 'session';
	var highscore = null;

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

	function getPlayer() {
		var defer = $q.defer();
		gameSocket.emit('getPlayer', function(info) {
			if (info) {
				defer.resolve(info);
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	function connect(scope) {
		gameSocket.forward([
			'answer-chosen',
			'connect',
			'disconnect',
			'highscore',
			'player',
			'player:update',
			'question',
			'solution'
		], scope);
	}

	function setAnswer(answer) {
		var defer = $q.defer();
		gameSocket.emit('answer', { answer: answer }, function(result) {
			if (result) {
				defer.resolve();
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	function getHighscore() {
		return highscore;
	}

	gameSocket.on('highscore', function(hs) {
		highscore = hs;
		$location.path('/highscore');
	});

	gameSocket.on('reset', function() {
		highscore = null;
		localStorageService.remove(SESSION_KEY);
		$location.path('/');
	});

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
		setAnswer: setAnswer,
		getHighscore: getHighscore,
		getPlayer: getPlayer
	};

});