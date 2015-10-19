angular.module('lvlup.client')
.controller('GameController', function($scope, game) {

	var ctrl = this;

	game.connect($scope);

	$scope.$on('game:player_info', function(ev, player) {
		ctrl.player = player;
	});

});