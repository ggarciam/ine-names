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
	var $http 		 		  = $injector.get('$http');
	var $timeout 		 	  = $injector.get('$timeout');
	var $q 		 	        = $injector.get('$q');
	var $log 		 	      = $injector.get('$log');

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
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FWikiproyecto%3ANombres_propios%2Flibro_de_los_nombres\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22mw-content-text%22%5D%2Ful%2Fli%2Fa\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

    $http({method: 'POST', url: url})
		.then(function successCallback(data) {

			var names = data.data.query.results.a;

			alphaComplet.push('a');

			angular.forEach(names, function(name){
		 		controller.names.push(name.content);
		 	});
		}, function errorCallback(data){
		 		console.log('error in letter a, ' + data);
		});

		angular.forEach(alphabet, function(letter) {

		  	url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'https%3A%2F%2Fes.wikipedia.org%2Fwiki%2FWikiproyecto%3ANombres_propios%2Flibro_de_los_nombres/' + letter + '\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22mw-content-text%22%5D%2Ful%2Fli%2Fa\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

			var letra = letter;

			$http({method: 'POST', url: url})
			.then(function successCallback(data) {
				var names = data.data.query.results.a;
				alphaComplet.push(letra);
				angular.forEach(names, function(name){
			 		controller.names.push(name.content);
			 	});

			 	if(alphaComplet.length === alphabet.length) {
          controller.names = controller.names.sort();
			 		localStorageService.set('names', controller.names);
			 	}

			}, function errorCallback(data){
		 		console.log('error in letter ' + letra + ', ' + data);
		 	});
		});
	}

	function getValues (){

		if(!controller.selectedItem || !controller.genre){return;}

		controller.isValid = true;
		controller.buttonInvalid = true;
		controller.values = [];
    controller.mode = 'indeterminate';

		//remove tildes as the INE portal doesn't accept them
    controller.name = controller.selectedItem;
		controller.nameCorrected = controller.selectedItem.replace(/(á|à|ä|â)/gi, 'a');
		controller.nameCorrected = controller.nameCorrected.replace(/(é|è|ë|ê)/gi, 'e');
		controller.nameCorrected = controller.nameCorrected.replace(/(í|ì|ï|î)/gi, 'i');
		controller.nameCorrected = controller.nameCorrected.replace(/(ó|ò|ö|ô)/gi, 'o');
		controller.nameCorrected = controller.nameCorrected.replace(/(ú|ù|ü|û)/gi, 'u');

		//genre -> 6 mujer, 1 hombre
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D\'http%3A%2F%2Fwww.ine.es%2Ftnombres%2FformGeneralresult.do%3FL%3D0%26vista%3D1%26orig%3Dine%26cmb4%3D99%26cmb6%3D' + controller.nameCorrected + '%26cmb7%3D' + controller.genre + '%26x%3D11%26y%3D5\'%20and%20xpath%3D\'%2F%2F*%5B%40id%3D%22formGeneral%22%5D%2Ftable%5B1%5D%2Ftbody%2Ftr%2Ftd%2Ftable%5B2%5D%2Ftbody%2Ftr%5B5%5D%2Ftd%2Ftable%2Ftbody%2Ftr\'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    $http({method: 'POST', url: url})
		.then(function successCallback(data) {



			if(data.data.query.results){
				controller.isValid = true;
				controller.values = data.data.query.results.tr; // response data

				angular.forEach(controller.values, function(value){

          if (value.th.length) {return;}
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
      controller.mode = '';

		}, function errorCallback(data){
		 		console.log('error in values request, ' + data);
		});
	}

	function orderTable(predicate){
		controller.reverse = (controller.predicate === predicate) ? !controller.reverse : true;
    	controller.predicate = predicate;
	}

  function newState(state) {
    console.log('This functionality is yet to be implemented!', state);
  }
  function querySearch (query) {
    var results = query ? controller.names.filter( createFilterFor(query) ) : controller.names, deferred;
    if (controller.simulateQuery) {
       deferred = $q.defer();
       $timeout(function () {
             deferred.resolve( results );
          },
      Math.random() * 1000, false);
       return deferred.promise;
    } else {
       return results;
    }
  }
  function searchTextChange(text) {
    $log.info('Text changed to ' + text);
  }
  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
  }

  //filter function for search query
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(name) {
       return (name.indexOf(lowercaseQuery) === 0);
    };
  }

	// 4 Expose methods and properties on the controller instance
	this.namesStored = localStorageService.get('names');
	this.names = controller.namesStored || [];
  this.name = '';
  this.nameCorrected = '';
	this.values = [];
  this.genre = '1';
  this.genres = [{
    value: '1',
    title: 'Hombre'
  },
  {
    value: '6',
    title: 'Mujer'
  }

  ];
	this.getNames = getNames;
	this.getValues = getValues;
	this.isValid = true;
	this.orderTable = orderTable;
	this.predicate = '';
  this.reverse = false;
  this.buttonInvalid = false;
  this.ordered = false;
  this.mode = '';

  controller.simulateQuery          = false;
  controller.isDisabled             = false;
  // list of states to be displayed
  controller.querySearch            = querySearch;
  controller.selectedItemChange     = selectedItemChange;
  controller.searchTextChange       = searchTextChange;
  controller.newState               = newState;

	// 5. Clean up
	$scope.$on('$destroy', function () {
		// Do whatever cleanup might be necessary
		controller = null; // MEMLEAK FIX
		$scope = null;	// MEMLEAK FIX
	});

	init();




  }]);
