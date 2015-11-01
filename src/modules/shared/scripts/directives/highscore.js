angular.module('lvlup.shared')
.directive('highscore', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/highscore.html',
		scope: {
			scores: '='
		}
	};
});