angular.module('lvlup.client')
.directive('keepScreenOn', function($window) {
	return {
		restrict: 'E',
		template: '<div class="keepscreenon" ng-class="{ \'keepscreenon--enabled\': isKeepOn }"><video class="keepscreenon__video" controls loop muted><source type="video/webm" src="data:video/webm;base64,GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAAByBFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEwTbuMU6uEHFO7a1OsggGr7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEUq17GDD0JATYCNTGF2ZjU2LjI1LjEwMVdBjUxhdmY1Ni4yNS4xMDFzpJDspePG9gGwYQj25uHJdXqORImIQECAAAAAAAAWVK5rAQAAAAAAADuuAQAAAAAAADLXgQFzxYEBnIEAIrWcg3VuZIaFVl9WUDiDgQEj44OEAfygVeABAAAAAAAABrCBAbqBAR9DtnUBAAAAAAAAKOeBAKOjgQAAgBACAJ0BKgEAAQAARwiFhYiFhIgCAgAMDWAA/v+j3gAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBd/CBAw=="></video><button class="keepscreenon__button" ng-click="keepOn()" ng-class="{ \'keepscreenon__button--hidden\': !isAndroidChrome }"><i class="icon-sun"></i> Keep screen on while playing</div>',
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