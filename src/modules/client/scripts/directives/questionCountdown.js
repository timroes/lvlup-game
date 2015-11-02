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
			enabled: '=',
			until: '=',
			total: '=',
			onEnd: '&'
		},
		link: function(scope, element) {
			var bar = element, endTime, total;

			function changeProgress() {
				var current = (scope.until - Date.now()) / total;
				bar.css('width', (current * 100) + '%');

				if (current > 0 && scope.enabled) {
					requestAnimFrame(changeProgress);
				} else {
					console.log("request animation end!", current);
					scope.$apply(function() {
						scope.onEnd();
					});
				}
			}

			function startCountdown() {
				if (!scope.total || !scope.until) return;

				total = scope.total;

				requestAnimFrame(changeProgress);
			}

			scope.$watch('until', startCountdown);

			scope.$watch('enabled', function(value) {
				if (value) {
					bar.css('display', 'block');
				} else {
					bar.css('display', 'none');
				}
			});

		}
	};

});