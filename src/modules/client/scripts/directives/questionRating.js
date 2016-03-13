function QuestionRatingController($scope) {
	'ngInject';
	$scope.$watch(() => this.rating, (rating) => {
		this.ratingArray = new Array(parseInt(rating || 0));
	});
}

const QuestionRatingComponent = {
	bindings: {
		rating: '='
	},
	controller: QuestionRatingController,
	template: `<div class="question-rating" ng-show="$ctrl.rating > 0">
		<i class="icon-award" ng-repeat="i in $ctrl.ratingArray track by $index"></i>
	</div>`
};

angular.module('lvlup.client')
.component('questionRating', QuestionRatingComponent);
