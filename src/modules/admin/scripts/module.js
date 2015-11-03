angular.module('lvlup.admin', [
	'ngTouch',
	'btford.socket-io',
	'ngFileUpload'
])
.run(function(adminSocket) {
	adminSocket.bind([
		'reset',
		'player:join',
		'players'
	]);
});