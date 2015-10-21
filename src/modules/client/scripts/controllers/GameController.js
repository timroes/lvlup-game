angular.module('lvlup.client')
.controller('GameController', function($scope, game) {

	var ctrl = this;

	game.connect($scope);

	ctrl.answer = function(id) {
		ctrl.answeringEnabled = false;
		game.setAnswer(id);
	};

	$scope.$on('game:player_info', function(ev, player) {
		ctrl.player = player;
	});

	$scope.$on('game:question', function(ev, question, timeRemaining) {
		ctrl.answeringEnabled = true;
		ctrl.question = question;
		ctrl.timeRemaining = timeRemaining;
	});

});