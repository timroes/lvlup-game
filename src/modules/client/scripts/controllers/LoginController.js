angular.module('lvlup.client')
.controller('LoginController', function($location, game) {

	var ctrl = this;

	if (game.getSession()) {
		$location.path('/game');
	}

	ctrl.login = function() {
		ctrl.error = null;
		game.login(this.name)
			.then(function() {
				$location.path('/game');
			})
			.catch(function(reason) {
				if (reason.status === 409) {
					ctrl.error = 'duplicateUsername';
				} else if(reason.status === 400) {
					ctrl.error = 'invalidUsername';
				} else {
					ctrl.error = 'generalError';
				}
			});
	};

});