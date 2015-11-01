angular.module('lvlup.screen')
.controller('ScreenController', function($location, screenSocket) {

	var ctrl = this;

	ctrl.highscores = null;

	ctrl.gameUrl = $location.absUrl().replace(/screen[/]?$/, '');

	// ctrl.

	screenSocket.on('highscore', function(scores) {
		console.log(scores);
		ctrl.highscores = scores;
	});

});