angular.module('lvlup.client')
.controller('HighscoreController', function(game) {
	var ctrl = this;

	game.getHighscore()
		.then(function(highscore) {
			ctrl.highscore = highscore;
		});

});