angular.module('lvlup.admin')
.controller('AdminController', function($window, $rootScope, game, questions, fileReader, players) {

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

	ctrl.setQuestion = function(id) {
		questions.setQuestion(id)
			.then(function() {
				ctrl.questions[id].asked = true;
			});
	}

	ctrl.addQuestions = function(file) {
		ctrl.uploadError = null;
		if (file) {
			// TODO: any kind of error checking on the questions object
			fileReader.readAsJson(file)
				.then(function(json) {
					return questions.addQuestions(json);
				})
				.then(function() {
					reloadQuestions();
				})
				.catch(function(reason) {
					$window.alert(reason);
					ctrl.uploadError = reason;
				});
		}
	};

	ctrl.players = [];

	$rootScope.$on('game:player:join', (ev, info) => {
		this.players.push(info);
	});

	$rootScope.$on('game:reset', () => {
		this.players = [];
		this.questions = null;
		this.answer = null;
		this.question = null;
	});

	$rootScope.$on('game:players', (ev, players) => {
		this.players = players;
	});

	$rootScope.$on('game:question', (ev, question) => {
		this.question = question;
		this.answer = null;
	});

	$rootScope.$on('game:answer', (ev, answer) => {
		this.answer = answer;
	});

});
