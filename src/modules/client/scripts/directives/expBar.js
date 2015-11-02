angular.module('lvlup.client')
.directive('expBar', function($timeout) {
	return {
		restrict: 'E',
		template: '<div class="expbar"><span class="expbar__bar"></span></div>',
		scope: {
			exp: '=',
			level: '=',
			levelDelayed: '='
		},
		link: function(scope, elem) {
			// TODO: somehow this should come from server
			var expPerLevel = 100;
			var bar = elem.find('span');

			var lastLvl, lastExp;

			scope.$watchGroup(['exp','level'], function(now) {

				var level = now[1], exp = now[0];

				if (lastLvl !== undefined && level > lastLvl) {
					// We have leveled up
					bar.css('width', '100%');
					$timeout(function() {
						scope.levelDelayed = level;
						bar.addClass('expbar__bar--jump');
						bar.css('width', '0%');
						$timeout(function() {
							bar.removeClass('expbar__bar--jump');
							bar.css('width', ((scope.exp / expPerLevel) * 100) + '%');
						}, 300);
					}, 1000);
				} else {
					scope.levelDelayed = level;
					// We only have gained/lost exp
					var percentage = (scope.exp / expPerLevel) * 100;
					bar.css('width', percentage + '%');
				}

				// We cannot use the second parameter to this function, which should hold the
				// previous values, since it does not hold the correct previous values all the time.
				lastLvl = level;
				lastExp = exp;
			});
		}
	};
});