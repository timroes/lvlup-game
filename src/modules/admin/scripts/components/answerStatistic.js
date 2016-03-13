const AnswerStatistic = {
		bindings: {
			stats: '='
		},
		template: `<div class="answer-statistic">
			<span class="answer-statistic__correct"><i class="icon-correct"></i> {{$ctrl.stats.correct}}</span>
			<span class="answer-statistic__noanswer"><i class="icon-noanswer"></i> {{$ctrl.stats.noanswer}}</span>
			<span class="answer-statistic__wrong"><i class="icon-wrong"></i> {{$ctrl.stats.wrong}}</span>
		</div>`
};

angular.module('lvlup.admin')
.component('answerStatistic', AnswerStatistic);
