angular.module('lvlup.client')
.factory('game', function($q, $http, $timeout, $location, localStorageService, gameSocket) {

	var SESSION_KEY = 'session';
	var pingTimeout;
	var measuredOffset = {
		offset: null,
		roundtrip: null
	};

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

	/**
	 * Calculates the client timestamp, when a question ends.
	 * @param {Number} timeRemaining - the milliseconds that the server said this question will still last
	 * @param {Number} serverEndTime - the server timestamp this question ends
	 * @returns {Number} A client timestamp when the questions should end.
	 */
	function getQuestionEndTime(timeRemaining, serverEndTime) {
		var now = Date.now();
		var byRemainingTime = now + timeRemaining;
		if (measuredOffset.offset === null) {
			// If we have no system clock offset measurement yet, we need to rely on the remainingTime
			// which might be a bit inaccurate due to delay in the websocket messages.
			return byRemainingTime;
		} else {
			// If we now the offset between client clock and server clock, we can calculate the client
			// timestamp from the server timestamp and use it. This should be more accurate because
			// it takes the transport delay into account.
			// We only ignore this value, if it's larger than the end time calculated via the remaining time.
			return Math.min(byRemainingTime, serverEndTime + measuredOffset.offset);
		}
	}

	function getCurrentQuestion() {
		var defer = $q.defer();
		gameSocket.emit('getCurrentQuestion', function(currentQuestion) {
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

	function schedulePing(timeout) {
		$timeout.cancel(pingTimeout);
		pingTimeout = $timeout(measureClockDiff, timeout);
	}

	/**
	 * Measure how much our client system clock is before or behind the server clock.
	 */
	function measureClockDiff() {
		var start = Date.now();
		gameSocket.emit('ping', function(result) {
			// End time = time we receive the ping response
			var end = Date.now();
			// The roundtrip time is the time the ping and response needed
			var roundtripTime = end - start;

			if (roundtripTime > 400) {
				// Drop every ping, that needed longer than 400ms for the server roundtrip
				// It's data might be to unreliable to get the server time.
				// Measure again in 1 to 3 seconds if we have no offset yet, if we already have one
				// wait the "regular" 30s for next measurement.
				console.log("Dropping server ping due to delay >400ms.");
				schedulePing(measuredOffset.offset === null ? 1000 + Math.random() * 2000 : 30000);
			} else {
				// The ping and response were fast enough to process the result.
				if (measuredOffset.roundtrip === null || measuredOffset.roundtrip >= roundtripTime) {
					// If we have no measurement yet or this ping was at least as fast as the previous one, use this result
					var clientOffset = (end - roundtripTime / 2) - result.time;
					console.log("Receiving ping response after %dms with client offset of %dms", roundtripTime, clientOffset);
					measuredOffset.roundtrip = roundtripTime;
					measuredOffset.offset = clientOffset;
				} else {
					console.log("Dropping ping with %dms roundtrip. Already have a lower roundtrip time result.", roundtripTime);
				}
				// Measure again in 30s
				schedulePing(30000);
			}
		});
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
		measureClockDiff();
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
		hasEnded: hasEnded,
		getQuestionEndTime: getQuestionEndTime
	};

});