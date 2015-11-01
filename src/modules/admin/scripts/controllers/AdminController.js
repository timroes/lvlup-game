angular.module('lvlup.admin')
.controller('AdminController', function($scope, game, questions, fileReader) {

	var ctrl = this;

	function reloadQuestions() {
		questions.getAll().then(function(ques) {
			ctrl.questions = ques;
		});
	}

	reloadQuestions();

	ctrl.endGame = game.end;

	ctrl.resetGame = game.reset;

	ctrl.endQuestion = questions.endQuestion;

	ctrl.setQuestion = questions.setQuestion;

	ctrl.addQuestions = function(file) {
		if (file) {
			// TODO: any kind of error checking on the questions object
			fileReader.readAsJson(file)
				.then(function(json) {
					return questions.addQuestions(json);
				})
				.then(function() {
					reloadQuestions();
				});
		}
	};

});