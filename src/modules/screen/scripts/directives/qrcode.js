angular.module('lvlup.screen')
.directive('qrcode', function() {
	return {
		restrict: 'E',
		template: '<figure class="qrcode-wrapper"><canvas class="qrcode"></canvas><figcaption class="qrcode-url" ng-bind="url"></figcaption></figure>',
		scope: {
			ngModel: '='
		},
		replace: true,
		link: function(scope, elem) {
			var qrcodedraw = new QRCodeLib.QRCodeDraw(),
				canvas = elem.find('canvas');

			scope.$watch('ngModel', function(val) {
				if (val) {
					// Strip http:// and trailing slash from url
					scope.url = val.replace(/^http:\/\//, '').replace(/\/$/, '');
					qrcodedraw.draw(canvas[0], val, { scale: 50 }, function(error, canvas) {
					});
				}
			});
		}
	}
});