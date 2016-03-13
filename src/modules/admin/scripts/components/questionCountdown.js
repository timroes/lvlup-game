function QuestionCountdownController($scope, $timeout) {
	'ngInject';

	let countdownTimeout;

	const refreshCountdown = () => {
		this.timeLeft--;
		if(this.timeLeft > 0) {
			countdownTimeout = $timeout(refreshCountdown, 1000);
		}
	};

	$scope.$watch(() => this.question, (question) => {
		if (!question) {
			this.timeLeft = null;
			$timeout.cancel(countdownTimeout);
			return;
		}
		if (countdownTimeout) {
			$timeout.cancel(countdownTimeout);
		}
		this.timeLeft = Math.ceil(question.timeRemaining / 1000);
		countdownTimeout = $timeout(refreshCountdown.bind(this), question.timeRemaining - ((this.timeLeft - 1)* 1000));
	});

	$scope.$on('$destroy', () => {
		$timeout.cancel(countdownTimeout);
	});
}

const QuestionCountdown = {
	bindings: {
		question: '='
	},
	controller: QuestionCountdownController,
	template: `<span class="question-countdown" ng-show="$ctrl.timeLeft || $ctrl.timeLeft === 0">{{ $ctrl.timeLeft }}s</span>`
};

angular.module('lvlup.admin')
.component('questionCountdown', QuestionCountdown);
