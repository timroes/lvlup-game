angular.module('lvlup.admin')
.factory('questions', function($http) {

	function getAll() {
		return $http.get('/admin/api/questions')
			.then(function(response) {
				return response.data;
			});
	}

	function setQuestion(id) {
		$http.post('/admin/api/question', { question: id });
	}

	return {
		getAll: getAll,
		setQuestion: setQuestion
	};

});