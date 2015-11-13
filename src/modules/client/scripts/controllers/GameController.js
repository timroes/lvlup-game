angular.module('lvlup.client')
.controller('GameController', function($scope, $location, game) {

	var ctrl = this;

	game.connect($scope);

	// Load player data when controller is initialized
	game.getPlayer().then(function(player) {
		ctrl.player = player;
	});

	game.getCurrentQuestion().then(function(question) {
		console.log(question);
		ctrl.question = question.question;
		ctrl.questionEndTime = Date.now() + question.remainingTime;
		ctrl.chosenAnswer = question.chosenAnswer;
		ctrl.answeringEnabled = !question.chosenAnswer;
	});

	ctrl.answer = function(answer) {
		if (!ctrl.answeringEnabled) return;

		ctrl.answeringEnabled = false;
		ctrl.chosenAnswer = answer;
		// TODO: show transmitting indicator
		game.setAnswer(ctrl.question.id, answer).then(function() {
			// TODO: hide transmitting indicator
		})
		.catch(function() {
			console.error("Could not send answer to server.");
			// TODO: Could not set answer (should be output anything)
		});
	};

	ctrl.timeUp = function() {
		ctrl.answeringEnabled = false;
	};

	$scope.$on('game:answer-chosen', function(ev, answer) {
		ctrl.answeringEnabled = false;
		ctrl.chosenAnswer = answer;
	});

	$scope.$on('game:player', function(ev, player) {
		ctrl.player = player;
	});

	$scope.$on('game:player:update', function(ev, update) {
		for (var key in update) {
			ctrl.player[key] = update[key];
		}
	});

	$scope.$on('game:question', function(ev, question, timeRemaining) {
		ctrl.chosenAnswer = null;
		ctrl.answeringEnabled = true;
		ctrl.question = question;
		ctrl.questionEndTime = Date.now() + timeRemaining;
		ctrl.solution = null;
	});

	$scope.$on('game:solution', function(ev, solution) {
		ctrl.solution = solution;
		ctrl.answeringEnabled = false;
	});

	// If the game ends continue to the highscore screen
	$scope.$on('game:end', function() {
		$location.path('/highscore');
	});

	$scope.$on('game:connect', function() {
		console.log("onConnect in controller");
		// TODO: hide loading spinner
	});

	$scope.$on('game:disconnect', function() {
		console.log("onDisconnect in controller");
		// TODO: show loading spinner of some kind
	});

});