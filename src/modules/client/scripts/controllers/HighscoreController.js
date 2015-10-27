angular.module('lvlup.client')
.controller('HighscoreController', function(game, $location) {
	var ctrl = this;

	ctrl.highscore = game.getHighscore();

	if (!ctrl.highscore) {
		// If no highscore is available we should not be on this page.
		$location.path('/');
	}
});