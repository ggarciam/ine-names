'use strict';

angular.module('ineNamesApp')

.directive('compileUnsafe', function ($compile) {
  return function (scope, element, attr) {
    scope.$watch(attr.compileUnsafe, function (val, oldVal) {
      if (!val || (val === oldVal && element[0].innerHTML)){return;}
      var div = angular.element('<div>');
      div.append(val);
      element.empty().append(div.contents());
      $compile(element.contents())(scope);
      // element.html(val);
      // $compile(element)(scope);
    });
  };
})
;
