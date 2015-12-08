(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Yii2AdminApplication = undefined;

var _BaseAction = require('./actions/BaseAction');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Yii2AdminApplication = (function () {
  function Yii2AdminApplication() {
    _classCallCheck(this, Yii2AdminApplication);

    if (typeof polyglot === 'undefined') {
      Yii2AdminApplication.warn('You MUST setup and configure devgroup/yii2-polyglot.');
    }

    if (typeof global.monster === 'undefined') {
      Yii2AdminApplication.warn('You MUST setup frontend-monster.');
    } else {
      this.monster = global.monster;
    }
    this.bindHelpers();
  }

  _createClass(Yii2AdminApplication, [{
    key: 'bindHelpers',
    value: function bindHelpers() {
      $('body').on('click', '[data-admin-url]', function clickHandler() {
        var element = $(this);
        var endpoint = element.data('adminUrl');

        var action = new _BaseAction.BaseAction(endpoint);
        action.run([]);
        return false;
      });
    }
  }, {
    key: 'modalNotifier',

    /*eslint-enable */
    value: function modalNotifier(message, criticalLevel) {
      return this.monster.showModalNotifier(message, criticalLevel);
    }
  }], [{
    key: 'warn',
    value: function warn(warningMessage) {
      /*eslint-disable */
      if (typeof console !== 'undefined') {
        console.warn(warningMessage);
      } else if (typeof alert === 'function') {
        alert(warningMessage);
      }
    }
  }]);

  return Yii2AdminApplication;
})();

exports.Yii2AdminApplication = Yii2AdminApplication;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./actions/BaseAction":2}],2:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseAction = undefined;

var _Yii2AdminApplication = require('../Yii2AdminApplication');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var BaseAction = (function () {
  function BaseAction(endpoint) {
    _classCallCheck(this, BaseAction);

    this.endpoint = endpoint;
    this.method = 'POST';
  }

  _createClass(BaseAction, [{
    key: 'run',
    value: function run(params) {
      return this.ajaxCall(params, function success(data) {
        // do something usefull with data
        console.log('do something usefull with data');
        console.log(data);

        if (data.notifications.length > 0) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.notifications[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var notification = _step.value;

              console.log(notification);
              global.monster.showBootstrapBoxNotifier(notification.message, notification.criticalLevel);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      });
    }
  }, {
    key: 'ajaxCall',
    value: function ajaxCall(params, callback) {
      return $.ajax({
        url: this.endpoint,
        method: this.method,
        data: params,
        success: function success(data) {
          callback(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          BaseAction.showErrorMessage(errorThrown);
        }
      });
    }
  }], [{
    key: 'showErrorMessage',
    value: function showErrorMessage(message) {
      return global.monster.modalNotifier(message, 'error');
    }
  }]);

  return BaseAction;
})();

exports.BaseAction = BaseAction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Yii2AdminApplication":1}],3:[function(require,module,exports){
(function (global){
'use strict';

var _Yii2AdminApplication = require('./Yii2AdminApplication.js');

global.AdminApp = new _Yii2AdminApplication.Yii2AdminApplication();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Yii2AdminApplication.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FjdGlvbnMvQmFzZUFjdGlvbi5qcyIsImpzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDRU0sb0JBQW9CLGdCQUN4QjtXQURJLG9CQUFvQixHQUNWOzBCQURWLG9CQUFvQixFQUV0Qjs7UUFBSSxPQUFPLFFBQVEsQUFBQyxLQUFLLFdBQVcsRUFBRSxBQUNwQzswQkFBb0IsQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQztLQUNuRixBQUVEOztRQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sQUFBQyxLQUFLLFdBQVcsRUFBRSxBQUMxQzswQkFBb0IsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztLQUMvRCxNQUFNLEFBQ0w7VUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0tBQy9CLEFBQ0Q7UUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztlQVpHLG9CQUFvQjs7a0NBY1YsQUFDWjtPQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxTQUFTLFlBQVksR0FBRyxBQUNoRTtZQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQUFDeEI7WUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxBQUUxQzs7WUFBTSxNQUFNLEdBQUcsZ0JBckJiLFVBQVUsQ0FxQmtCLFFBQVEsQ0FBQyxDQUFDLEFBQ3hDO2NBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQUFDZjtlQUFPLEtBQUssQ0FBQztPQUNkLENBQUMsQ0FBQztLQUNKOzs7OztrQ0FZYSxPQUFPLEVBQUUsYUFBYSxFQUFFLEFBQ3BDO2FBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7S0FDL0Q7Ozt5QkFaVyxjQUFjLEVBQUUsQUFFMUI7O1VBQUksT0FBTyxPQUFPLEFBQUMsS0FBSyxXQUFXLEVBQUUsQUFDbkM7ZUFBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztPQUM5QixNQUFNLElBQUksT0FBTyxLQUFLLEFBQUMsS0FBSyxVQUFVLEVBQUUsQUFDdkM7YUFBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQ3ZCO0tBRUY7OztTQWpDRyxvQkFBb0I7OztRQXdDbEIsb0JBQW9CLEdBQXBCLG9CQUFvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ3hDdEIsVUFBVSxnQkFDZDtXQURJLFVBQVUsQ0FDRixRQUFRLEVBQUU7MEJBRGxCLFVBQVUsRUFFWjs7UUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsQUFDekI7UUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7O2VBSkcsVUFBVTs7d0JBTVYsTUFBTSxFQUFFLEFBQ1Y7YUFBTyxJQUFJLENBQUMsUUFBUSxDQUNsQixNQUFNLEVBQ04sU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEFBRXJCOztlQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQUFDOUM7ZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxBQUdsQjs7WUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Ozs7O2NBQ2pDO2lDQUEyQixJQUFJLENBQUMsYUFBYSw4SEFBRTtrQkFBcEMsWUFBWSxlQUNyQjs7cUJBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQUFDMUI7b0JBQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDM0Y7Ozs7Ozs7Ozs7Ozs7OztTQUNGO09BQ0YsQ0FDRixDQUFDO0tBQ0g7Ozs2QkFNUSxNQUFNLEVBQUUsUUFBUSxFQUFFLEFBQ3pCO2FBQU8sQ0FBQyxDQUFDLElBQUksQ0FDWCxBQUNFO1dBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUNsQjtjQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQUFDbkI7WUFBSSxFQUFFLE1BQU0sQUFDWjtlQUFPLEVBQUUsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEFBQzlCO2tCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEIsQUFDRDthQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQUFDcEQ7b0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMxQztPQUNGLENBQ0YsQ0FBQztLQUNIOzs7cUNBbEJ1QixPQUFPLEVBQUUsQUFDL0I7YUFBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdkQ7OztTQTNCRyxVQUFVOzs7UUE2Q1IsVUFBVSxHQUFWLFVBQVU7Ozs7Ozs7Ozs7QUM3Q2xCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsMEJBRlYsb0JBQW9CLEVBRWdCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtCYXNlQWN0aW9ufSBmcm9tICcuL2FjdGlvbnMvQmFzZUFjdGlvbic7XG5cbmNsYXNzIFlpaTJBZG1pbkFwcGxpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZihwb2x5Z2xvdCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBhbmQgY29uZmlndXJlIGRldmdyb3VwL3lpaTItcG9seWdsb3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihnbG9iYWwubW9uc3RlcikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBmcm9udGVuZC1tb25zdGVyLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbnN0ZXIgPSBnbG9iYWwubW9uc3RlcjtcbiAgICB9XG4gICAgdGhpcy5iaW5kSGVscGVycygpO1xuICB9XG5cbiAgYmluZEhlbHBlcnMoKSB7XG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1hZG1pbi11cmxdJywgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9ICQodGhpcyk7XG4gICAgICBjb25zdCBlbmRwb2ludCA9IGVsZW1lbnQuZGF0YSgnYWRtaW5VcmwnKTtcblxuICAgICAgY29uc3QgYWN0aW9uID0gbmV3IEJhc2VBY3Rpb24oZW5kcG9pbnQpO1xuICAgICAgYWN0aW9uLnJ1bihbXSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgd2Fybih3YXJuaW5nTWVzc2FnZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihhbGVydCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFsZXJ0KHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH1cblxuICBtb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5tb25zdGVyLnNob3dNb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpO1xuICB9XG59XG5cbmV4cG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259O1xuIiwiaW1wb3J0IHtZaWkyQWRtaW5BcHBsaWNhdGlvbn0gZnJvbSAnLi4vWWlpMkFkbWluQXBwbGljYXRpb24nO1xuXG5jbGFzcyBCYXNlQWN0aW9uIHtcbiAgY29uc3RydWN0b3IoZW5kcG9pbnQpIHtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5tZXRob2QgPSAnUE9TVCc7XG4gIH1cblxuICBydW4ocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWpheENhbGwoXG4gICAgICBwYXJhbXMsXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgLy8gZG8gc29tZXRoaW5nIHVzZWZ1bGwgd2l0aCBkYXRhXG4gICAgICAgIGNvbnNvbGUubG9nKCdkbyBzb21ldGhpbmcgdXNlZnVsbCB3aXRoIGRhdGEnKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cblxuICAgICAgICBpZiAoZGF0YS5ub3RpZmljYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IG5vdGlmaWNhdGlvbiBvZiBkYXRhLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICBnbG9iYWwubW9uc3Rlci5zaG93Qm9vdHN0cmFwQm94Tm90aWZpZXIobm90aWZpY2F0aW9uLm1lc3NhZ2UsIG5vdGlmaWNhdGlvbi5jcml0aWNhbExldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBnbG9iYWwubW9uc3Rlci5tb2RhbE5vdGlmaWVyKG1lc3NhZ2UsICdlcnJvcicpO1xuICB9XG5cbiAgYWpheENhbGwocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkLmFqYXgoXG4gICAgICB7XG4gICAgICAgIHVybDogdGhpcy5lbmRwb2ludCxcbiAgICAgICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgIEJhc2VBY3Rpb24uc2hvd0Vycm9yTWVzc2FnZShlcnJvclRocm93bik7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IHtCYXNlQWN0aW9ufTtcbiIsImltcG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259IGZyb20gJy4vWWlpMkFkbWluQXBwbGljYXRpb24uanMnO1xuXG5nbG9iYWwuQWRtaW5BcHAgPSBuZXcgWWlpMkFkbWluQXBwbGljYXRpb24oKTtcblxuIl19
