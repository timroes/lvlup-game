angular.module('lvlup.client')
.directive('keepScreenOn', function($window) {
	return {
		restrict: 'E',
		template: '<div class="keepscreenon" ng-class="{ \'keepscreenon--enabled\': isKeepOn || !isAndroidChrome }"><video class="keepscreenon__video" controls loop muted><source type="video/webm" src="data:video/webm;base64,"></video><button class="keepscreenon__button" ng-click="keepOn()"><i class="icon-sun"></i> Keep screen on while playing</div>',
		replace: true,
		link: function(scope, elem) {
			var video = elem.find('video')[0];
			var userAgent = navigator.userAgent.toLowerCase() || "";
			scope.isAndroidChrome = userAgent.indexOf('android') > -1 && userAgent.indexOf('chrome') > -1;

			scope.keepOn = function() {
				video.pause();
				video.play();
				scope.isKeepOn = true;
			};

			document.addEventListener('visibilitychange', function() {
				scope.$apply(function() {
					scope.isKeepOn = false;
				});
			});
		}
	};
});