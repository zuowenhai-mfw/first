'use strict';
/**
 * ngTip - simple tip service
 * http://github.com/savokiss/ngTip
 */
angular.module('ngTip', [])
  .directive('ngTip', ngTipDirective)
  .provider('ngTip', ngTipProvider);

ngTipDirective.$inject = ['ngTip'];
function ngTipDirective(ngTip) {
  return {
    restrict: 'EA',
    template: '<div class="alert alert-{{ngTip.type || \'info\'}} ngTip" ng-show="ngTip.msg">' +
    '<button type="button" class="close"  ng-click="hideAlert()">' +
    '<span class="fa fa-remove"></span></button>{{ngTip.msg}}</div>',

    link: function (scope, element, attrs) {
      scope.ngTip = ngTip;
      scope.hideAlert = function () {
        ngTip.msg = null;
        ngTip.type = null;
      };
    }
  };
}

function ngTipProvider() {
  var self = this;

  self.timeout = 3000;
  self.setDefaultTimeout = function(defaultTimeout){
    self.timeout = defaultTimeout;
  };

  self.$get = ['$timeout',function($timeout){
    var cancelTimeout = null;

    return {
      msg: null,
      type: null,
      tip: tip,
      clear: clear
    };

    /**
     * set msg
     * default last 3s
     * @param msg
     * @param type
     */
    function tip(msg,type) {
      var that = this;
      this.msg = msg;
      this.type = type;

      if(cancelTimeout){
        $timeout.cancel(cancelTimeout);
      }
      cancelTimeout = $timeout(function () {
        that.clear();
      }, self.timeout);
    }

    /**
     * clear msg
     */
    function clear() {
      this.msg = null;
      this.type = null;
    }
  }];

}


