angular.module('lvlup.screen')
.controller('ScreenController', function($location) {

	var ctrl = this;

	ctrl.gameUrl = $location.absUrl().replace(/screen[/]?$/, '');

});