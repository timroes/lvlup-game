angular.module('lvlup.admin', [
	'lvlup.shared',
	'ngTouch',
	'btford.socket-io',
	'ngFileUpload'
])
.run(function(adminSocket) {
	adminSocket.bind([
		'reset',
		'player:join',
		'players',
		'question',
		'answer'
	]);
});
