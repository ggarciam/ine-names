'use strict';
// configure and load languages in extra file to separate from tests
angular.module('ineNamesApp').config(['$translateProvider', function ($translateProvider) {

  // load data from $templateCache instead of $http cache
  $translateProvider.useLoaderCache('$templateCache')

  // sanitizer
  .useSanitizeValueStrategy('sanitize')

  // use local storage to save user setting
  .useLocalStorage()

  // Define fallback lang
  .fallbackLanguage( 'en' )

  // load 'en' table on startup
  // .preferredLanguage('en');

  // Determine the prefered language from browser settings
  .determinePreferredLanguage()

  // load main language file
  .useStaticFilesLoader({
    prefix: 'lang/locale-',
    suffix: '.json'
  })
  .use('en_US');

}]);
