angular.module('lvlup.admin')
.factory('game', function($http) {

	function end() {
		return $http.post('/admin/api/endGame');
	}

	return {
		end: end
	};

});