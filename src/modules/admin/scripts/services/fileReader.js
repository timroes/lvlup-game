angular.module('lvlup.admin')
.factory('fileReader', function($q) {

	function readAsText(fileObj) {
		var reader = new FileReader();
		var defer = $q.defer();

		reader.onload = function(ev) {
			defer.resolve(ev.target.result);
		};

		reader.readAsText(fileObj);

		return defer.promise;
	}

	function readAsJson(fileObj) {
		return readAsText(fileObj)
			.then(function(text) {
				try {
					return JSON.parse(text);
				} catch(e) {
					return $q.reject(e.message);
				}
			});
	}

	return {
		readAsText: readAsText,
		readAsJson: readAsJson
	};

});