angular.module('lvlup.screen')
.controller('ScreenController', function($location, screenSocket) {

	var ctrl = this;

	ctrl.highscores = null;

	ctrl.gameUrl = $location.absUrl().replace(/screen[/]?$/, '');

	function minimizeQrCode() {
		ctrl.qrcodeclass = 'minimized';
	}

	function maximizeQrCode() {
		ctrl.qrcodeclass = '';
	}

	screenSocket.on('statistics', function(stats) {
		ctrl.statistics = stats;
		minimizeQrCode();
	});

	screenSocket.on('highscore', function(scores) {
		ctrl.highscores = scores;
		minimizeQrCode();
	});

	screenSocket.on('reset', function() {
		ctrl.highscores = null;
		ctrl.statistics = null;
		maximizeQrCode();
	});


});