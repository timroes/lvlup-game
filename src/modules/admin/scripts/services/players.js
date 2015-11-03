angular.module('lvlup.admin')
.factory('players', function($http) {

	function get() {
		return $http.get('/admin/api/players')
			.then(function(response) {
				return response.data;
			});
	}

	return {
		get: get
	};

});