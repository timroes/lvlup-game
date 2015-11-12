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

	ctrl.setQuestion = questions.setQuestion;

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

	players.get().then(function(players) {
		ctrl.players = ctrl.players.concat(players);
	});

	$rootScope.$on('game:player:join', function(ev, info) {
		ctrl.players.push(info);
	});

	$rootScope.$on('game:reset', function() {
		ctrl.players = [];
	});

	$rootScope.$on('game:players', function(ev, players) {
		console.log("Hello??");
		ctrl.players = players;
	});

});