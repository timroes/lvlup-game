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

	function endQuestion() {
		$http.post('/admin/api/endQuestion');
	}

	function addQuestions(questions) {
		return $http.put('/admin/api/questions', questions);
	}

	return {
		addQuestions: addQuestions,
		getAll: getAll,
		endQuestion: endQuestion,
		setQuestion: setQuestion
	};

});