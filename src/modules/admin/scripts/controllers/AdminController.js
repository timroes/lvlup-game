angular.module('lvlup.admin')
.controller('AdminController', function(questions) {

	var ctrl = this;

	questions.getAll().then(function(ques) {
		ctrl.questions = ques;
	});

	ctrl.setQuestion = questions.setQuestion;

});