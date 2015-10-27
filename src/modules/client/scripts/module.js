angular.module('lvlup.client', [
	'lvlup.client.templates',
	'ngRoute',
	'ngTouch',
	'LocalStorageModule',
	'btford.socket-io'
])
.config(function($routeProvider) {
	$routeProvider
		.when('/login', {
			controller: 'LoginController',
			controllerAs: 'login',
			templateUrl: 'views/login.html'
		})
		.when('/game', {
			controller: 'GameController',
			controllerAs: 'game',
			templateUrl: 'views/game.html'
		})
		.when('/highscore', {
			controller: 'HighscoreController',
			controllerAs: 'ctrl',
			templateUrl: 'views/highscore.html'
		})
		.otherwise({
			redirectTo: '/login'
		});
})
.config(function(localStorageServiceProvider) {
	localStorageServiceProvider.setPrefix('lvlup');
});
