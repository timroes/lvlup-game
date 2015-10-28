angular.module('lvlup.screen')
.directive('qrcode', function() {
	return {
		restrict: 'E',
		template: '<canvas class="qrcode"></canvas>',
		scope: {
			ngModel: '='
		},
		replace: true,
		link: function(scope, elem) {
			var qrcodedraw = new QRCodeLib.QRCodeDraw(),
				canvas = elem.find('canvas');

			scope.$watch('ngModel', function(val) {
				if (val) {
					qrcodedraw.draw(elem[0], val, {scale: 50 }, function(error, canvas) {

					});
				}
			});
		}
	}
});