'use strict';

/**
 * @ngdoc function
 * @name ineNamesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ineNamesApp
 */
angular.module('ineNamesApp')
  .controller('RestCtrl', ['$scope', '$injector', 'localStorageService',
  function ($scope, $injector, localStorageService) {

	// 1 self reference
	var controller = this;

	// 2 requirements
	// var imageLoader   	 = $injector.get('imageLoaderService');
	// var $rootScope 		 = $injector.get('$rootScope');
	var $http 		 		 = $injector.get('$http');

	// 3 Do scope stuff
	// 3a Set up watchers on the scope
	// 3b Expose methods or data on the scope
	// 3c Listen to events on the scope
	// $scope.$watch('names', function () {
	//   localStorageService.set('names', controller.names);
	// }, true);
	// 6. All the actual implementation goes here
	function init () {

		//if names not stored in localStorage
		if(controller.names.length === 0){
			controller.getNames();
		}
	}

	function getNames() {

		var alphabet = 'bcdefghijklmnopqrstuvwxyz'.split('');
		var alphaComplet = [];

		// letter a has no value in wikipedia, we have to do it apart.
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.html.cssselect%20where%20url%3D%22https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FWikiproyecto%3ANombres_propios%2Flibro_de_los_nombres%22%20and%20css%3D%22.mw-content-ltr%20%3Eul%20a%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

		$http({method: 'POST', url: url})
		.then(function successCallback(data) {

			var names = data.data.query.results.results.a;

			alphaComplet.push('a');

			angular.forEach(names, function(name){
		 		controller.names.push(name.content);
		 	});
		}, function errorCallback(data){
		 		console.log('error in letter a, ' + data);
		});

		angular.forEach(alphabet, function(letter) {

		  	url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.html.cssselect%20where%20url%3D%22https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FWikiproyecto%3ANombres_propios%2Flibro_de_los_nombres%2F' + letter + '%22%20and%20css%3D%22.mw-content-ltr%20%3Eul%20a%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

			var letra = letter;

			$http({method: 'POST', url: url})
			.then(function successCallback(data) {
				var names = data.data.query.results.results.a;
				alphaComplet.push(letra);
				angular.forEach(names, function(name){
			 		controller.names.push(name.content);
			 	});

			 	if(alphaComplet.length === alphabet.length) {
			 		localStorageService.set('names', controller.names);
			 	}

			}, function errorCallback(data){
		 		console.log('error in letter ' + letra + ', ' + data);
		 	});
		});
	}

	function getValues(){

		if(!$scope.name || !$scope.genre){return;}

		controller.isValid = true;
		controller.buttonInvalid = true;
		controller.values = {};

		//remove tildes as the INE portal doesn't accept them
		$scope.name = $scope.name.replace(/(á|à|ä|â)/gi, 'a');
		$scope.name = $scope.name.replace(/(é|è|ë|ê)/gi, 'e');
		$scope.name = $scope.name.replace(/(í|ì|ï|î)/gi, 'i');
		$scope.name = $scope.name.replace(/(ó|ò|ö|ô)/gi, 'o');
		$scope.name = $scope.name.replace(/(ú|ù|ü|û)/gi, 'u');

		//genre -> 6 mujer, 1 hombre

		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.html.cssselect%20where%20url%3D%22http%3A%2F%2Fwww.ine.es%2Ftnombres%2FformGeneralresult.do%3FL%3D0%26vista%3D1%26orig%3Dine%26cmb4%3D99%26cmb6%3D' + $scope.name + '%26cmb7%3D' + $scope.genre + '%26x%3D11%26y%3D5%22%20and%20css%3D%22tr.normal%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
		$http({method: 'POST', url: url})
		.then(function successCallback(data) {



			if(data.data.query.results && data.data.query.results.results){
				controller.isValid = true;
				controller.values = data.data.query.results.results.tr; // response data

				angular.forEach(controller.values, function(value){

					value.provincia = value.th.content.replace(/\n|^\s+|\s+$/gm, '');
					var that = value;

					angular.forEach(value.td, function(value, key){
						if(key===0){
							that.number = parseInt(value.content.replace(/\n|^\s+|\s+$|\t|[.]|<!--(.*?)-->/gm, ''));
						} else {
							that.percent = value.content.replace(/\n|^\s+|\s+$|\t|[.]|<!--(.*?)-->/gm, '');
						}

					});

				});
			} else {
				controller.isValid = false;
			}

			controller.buttonInvalid = false;

		}, function errorCallback(data){
		 		console.log('error in values request, ' + data);
		});
	}

	function orderTable(predicate){
		controller.reverse = (controller.predicate === predicate) ? !controller.reverse : true;
    	controller.predicate = predicate;
	}

	// 4 Expose methods and properties on the controller instance
	this.namesStored = localStorageService.get('names');
	this.names = controller.namesStored || [];
	this.values = {};
	this.getNames = getNames;
	this.getValues = getValues;
	this.isValid = true;
	this.orderTable = orderTable;
	this.predicate = '';
  	this.reverse = false;
  	this.buttonInvalid = false;

	// 5. Clean up
	$scope.$on('$destroy', function () {
		// Do whatever cleanup might be necessary
		controller = null; // MEMLEAK FIX
		$scope = null;	// MEMLEAK FIX
	});

	init();




  }]);
