angular.module('lvlup.client')
.controller('LoginController', function($location, game) {

	if (game.getSession()) {
		$location.path('/game');
	}

	this.login = function() {
		game.login(this.name)
			.then(function() {
				$location.path('/game');
			});
	};

});