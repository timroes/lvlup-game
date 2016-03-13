const QuestionBody = {
	bindings: {
		question: '='
	},
	template: `<div class="question-body" ng-switch="$ctrl.question.type">
		<span ng-switch-default>{{ $ctrl.question.question }}</span>
	</div>`
};

angular.module('lvlup.shared')
.component('questionBody', QuestionBody);
