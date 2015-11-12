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

	$rootScope.$on('game:player:join', function(ev, info) {
		ctrl.players.push(info);
	});

	$rootScope.$on('game:reset', function() {
		ctrl.players = [];
		ctrl.questions = null;
	});

	$rootScope.$on('game:players', function(ev, players) {
		ctrl.players = players;
	});

});