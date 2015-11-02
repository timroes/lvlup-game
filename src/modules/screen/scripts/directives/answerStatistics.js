angular.module('lvlup.screen')
.directive('answerStatistics', function() {
	return {
		restrict: 'E',
		scope: {
			stats: '='
		},
		template: '<canvas ng-if="statsData" class="chart chart-doughnut stats-chart" chart-data="statsData" chart-labels="statsLabels" chart-colours="colors" chart-options="opts"></canvas>',
		link: function(scope) {
			scope.opts = {
				animationSteps: 45,
				animationEasing: 'easeOutQuart',
				segmentShowStroke: false
			};
			scope.statsLabels = ['Correct', 'Wrong', 'No Answer'];
			scope.colors = ['#4CAF50', '#F44336', '#607D8B'];
			scope.$watch('stats', function(stats) {
				if (stats) {
					scope.statsData = [
						stats.correct,
						stats.wrong,
						stats.noanswer
					];
				}
			});
		}
	};
});