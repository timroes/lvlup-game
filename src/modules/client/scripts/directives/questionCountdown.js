angular.module('lvlup.client')
.directive('questionCountdown', function($rootScope) {

	var requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
		})();

	return {
		restrict: 'E',
		scope: {
			remaining: '=',
			total: '=',
			onEnd: '&'
		},
		link: function(scope, element) {
			var bar = element, endTime, total;

			function changeProgress() {
				var current = (endTime - Date.now()) / total;
				bar.css('width', (current * 100) + '%');

				if (current > 0) {
					requestAnimFrame(changeProgress);
				} else {
					scope.$apply(function() {
						scope.onEnd();
					});
				}
			}

			function startCountdown() {
				if (!scope.total || !scope.remaining) return;

				endTime = Date.now() + scope.remaining;
				total = scope.total;

				requestAnimFrame(changeProgress);
			}

			scope.$watch('remaining', startCountdown);

			$rootScope.$on('answerCountdown:reset', startCountdown);

		}
	};

});