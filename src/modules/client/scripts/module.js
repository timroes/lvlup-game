angular.module('lvlup.client', [
	'lvlup.client.templates',
	'lvlup.shared',
	'ngRoute',
	'ngTouch',
	'LocalStorageModule',
	'btford.socket-io'
])
.config(function($routeProvider) {

	function gameStateResolver(target) {
		return {
			gameStateResolve: ['$q', 'game', function($q, game) {
				if (!game.getSession()) {
					if (target !== 'login') {
						// If the user does not have a session and tries to go to any non-login page
						// reject and redirect to /login
						return $q.reject('/login');
					}
				} else {
					// The user has a session, so check to what state the game currently is in
					return game.hasEnded()
						.then(function(ended) {
							if (ended) {
								// If the game has ended user should go to the highscore page
								return target === 'highscore' ? $q.when() : $q.reject('/highscore');
							} else {
								// If the game is still running user should be on the game page
								return target === 'game' ? $q.when() : $q.reject('/game');
							}
						});
				}
				return $q.when();
			}]
		};
	}

	$routeProvider
		.when('/login', {
			controller: 'LoginController',
			controllerAs: 'login',
			templateUrl: 'views/login.html',
			resolve: gameStateResolver('login')
		})
		.when('/game', {
			controller: 'GameController',
			controllerAs: 'game',
			templateUrl: 'views/game.html',
			resolve: gameStateResolver('game')
		})
		.when('/highscore', {
			controller: 'HighscoreController',
			controllerAs: 'ctrl',
			templateUrl: 'views/highscore.html',
			resolve: gameStateResolver('highscore')
		})
		.otherwise({
			redirectTo: '/login'
		});
})
.config(function(localStorageServiceProvider) {
	localStorageServiceProvider.setPrefix('lvlup');
})
.run(function($rootScope, $location) {
	// Catch all routeChangeErrors to check whether we need to route to another page du eto game state
	$rootScope.$on('$routeChangeError', function(ev, curr, prev, rejectReason) {
		// If the route change was rejected by a promise (i.e. we rejected it due to wrong game states)
		// route to whatever page fits the game state (we used it as a rejection reason)
		if (rejectReason) {
			$location.path(rejectReason);
		}
	});
});
