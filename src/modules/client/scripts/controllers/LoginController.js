angular.module('lvlup.client')
.controller('LoginController', function($rootScope, $location, game) {

	var ctrl = this;

	ctrl.login = function() {
		ctrl.error = null;
		game.login(ctrl.name)
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