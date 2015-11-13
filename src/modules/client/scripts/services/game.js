angular.module('lvlup.client')
.factory('game', function($q, $http, $rootScope, $location, localStorageService, gameSocket) {

	var SESSION_KEY = 'session';

	function socketAuth() {
		if (getSession()) {
			gameSocket.emit('authenticate', { session: getSession() }, function(valid) {
				console.log("is current session valid?", valid);
				if (!valid) {
					localStorageService.remove(SESSION_KEY);
					// TODO: forward to an error start page instead,
					// our session is not valid (anymore)
					$location.path('/');
				}
			});
			
		}
	}

	function getCurrentQuestion() {
		var defer = $q.defer();
		gameSocket.emit('getCurrentQuestion', function(currentQuestion) {
			console.log("currentQuestion", currentQuestion);
			if (currentQuestion) {
				defer.resolve(currentQuestion);
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	function getHighscore() {
		var defer = $q.defer();
		gameSocket.emit('getHighscore', function(highscore) {
			if (highscore) {
				defer.resolve(highscore);
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	function hasEnded() {
		var defer = $q.defer();
		gameSocket.emit('hasEnded', function(ended) {
			return defer.resolve(ended);
		});
		return defer.promise;
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
			'end',
			'player',
			'player:update',
			'question',
			'solution'
		], scope);
	}

	function setAnswer(questionId, answer) {
		var defer = $q.defer();
		gameSocket.emit('answer', { questionId: questionId, answer: answer }, function(result) {
			if (result) {
				defer.resolve();
			} else {
				defer.reject();
			}
		});
		return defer.promise;
	}

	gameSocket.on('reset', function() {
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
		getCurrentQuestion: getCurrentQuestion,
		login: login,
		connect: connect,
		setAnswer: setAnswer,
		getHighscore: getHighscore,
		getPlayer: getPlayer,
		hasEnded: hasEnded
	};

});