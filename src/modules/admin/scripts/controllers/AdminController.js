angular.module('lvlup.admin')
.controller('AdminController', function(game, questions) {

	var ctrl = this;

	questions.getAll().then(function(ques) {
		ctrl.questions = ques;
	});

	ctrl.endGame = game.end;

	ctrl.endQuestion = questions.endQuestion;

	ctrl.setQuestion = questions.setQuestion;

});