angular.module('lvlup.admin')
.factory('game', function($http) {

	function end() {
		return $http.post('/admin/api/game/end');
	}

	function reset() {
		return $http.post('/admin/api/game/reset');
	}

	return {
		end: end,
		reset: reset
	};

});