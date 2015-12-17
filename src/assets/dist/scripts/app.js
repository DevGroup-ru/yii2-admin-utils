(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Yii2AdminApplication = undefined;

var _BaseAction = require('./actions/BaseAction');

var _ModalDialog = require('./actions/ModalDialog');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      $('body').on('click', '[data-admin-action]', function clickHandler() {
        var element = $(this);
        var actionType = element.data('adminAction');
        if (actionType === 'ModalDialog') {
          _ModalDialog.ModalDialog.instance(element);
        } else {
          var endpoint = element.attr('href') || element.closest('form').attr('action');
          var action = new _BaseAction.BaseAction(endpoint);
          action.run([]);
        }
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

},{"./actions/BaseAction":2,"./actions/ModalDialog":3}],2:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseAction = (function () {
  function BaseAction(endpoint) {
    _classCallCheck(this, BaseAction);

    this.endpoint = endpoint;
    this.method = 'POST';
    this.monsterErrorNotifierFunction = 'modalNotifier';
  }

  _createClass(BaseAction, [{
    key: 'run',
    value: function run(params, successCallback, errorCallback) {
      return this.ajaxCall(params, function success(data) {
        // show all notifications from backend
        if (data.notifications.length > 0) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.notifications[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var notification = _step.value;

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
        // call corresponding callback
        if (data.error === false) {
          if (successCallback !== null) {
            successCallback(data.content);
          }
        } else {
          if (errorCallback !== null) {
            errorCallback(data);
          }
        }
      });
    }
  }, {
    key: 'showErrorMessage',
    value: function showErrorMessage(message) {
      return global.monster[this.monsterErrorNotifierFunction](message, 'error');
    }
  }, {
    key: 'ajaxCall',
    value: function ajaxCall(params, successCallback, errorCallback) {
      return $.ajax({
        url: this.endpoint,
        method: this.method,
        data: params,
        success: function success(data) {
          successCallback(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          this.showErrorMessage(errorThrown);
          errorCallback([], jqXHR, textStatus, errorThrown);
        }
      });
    }
  }], [{
    key: 'instance',
    value: function instance() {
      for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(this, [null].concat(rest)))();
    }
  }]);

  return BaseAction;
})();

exports.BaseAction = BaseAction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalDialog = undefined;

var _BaseAction2 = require('./BaseAction');

var _Yii2AdminApplication = require('../Yii2AdminApplication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalDialog = (function (_BaseAction) {
  _inherits(ModalDialog, _BaseAction);

  function ModalDialog(element) {
    _classCallCheck(this, ModalDialog);

    var endpoint = '';
    var paramsCallback = null;
    console.log(element[0].nodeName.toLowerCase());
    switch (element[0].nodeName.toLowerCase()) {
      case 'button':
      case 'input':
        var form = element.closest('form');
        paramsCallback = function params() {
          return form.serializeArray();
        };
        endpoint = form.attr('action');
        break;
      case 'a':
        paramsCallback = function params() {
          return [];
        };
        endpoint = element.attr('href');
        break;
      default:
        _Yii2AdminApplication.Yii2AdminApplication.warn('ModalDialog action expects element of type button, input or a for endpoint detection');
        paramsCallback = function params() {
          _Yii2AdminApplication.Yii2AdminApplication.warn('default paramsCallback called');
        };
        break;
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModalDialog).call(this, endpoint));

    _this.element = element;

    _get(Object.getPrototypeOf(ModalDialog.prototype), 'run', _this).call(_this, paramsCallback(), function success(content) {
      global.monster.showBootstrapModalNotifier(content);
    });
    return _this;
  }

  return ModalDialog;
})(_BaseAction2.BaseAction);

exports.ModalDialog = ModalDialog;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Yii2AdminApplication":1,"./BaseAction":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var _Yii2AdminApplication = require('./Yii2AdminApplication.js');

global.AdminApp = new _Yii2AdminApplication.Yii2AdminApplication();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Yii2AdminApplication.js":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FjdGlvbnMvQmFzZUFjdGlvbi5qcyIsImpzL2FjdGlvbnMvTW9kYWxEaWFsb2cuanMiLCJqcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDR00sb0JBQW9CO0FBQ3hCLFdBREksb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9COztBQUV0QixRQUFJLE9BQU8sUUFBUSxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQ3BDLDBCQUFvQixDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0tBQ25GOztBQUVELFFBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQzFDLDBCQUFvQixDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0tBQy9ELE1BQU07QUFDTCxVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7S0FDL0I7QUFDRCxRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O2VBWkcsb0JBQW9COztrQ0FjVjtBQUNaLE9BQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFNBQVMsWUFBWSxHQUFHO0FBQ25FLFlBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixZQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQy9DLFlBQUksVUFBVSxLQUFLLGFBQWEsRUFBRTtBQUNoQyx1QkFyQkEsV0FBVyxDQXFCQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0IsTUFBTTtBQUNMLGNBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxD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QW9CLENBdUJDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQzVELENBQUM7QUFDRixjQUFNO0FBQUEsS0FDUDs7dUVBeEJDLFdBQVcsYUF5QlAsUUFBUTs7QUFFZCxVQUFLLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLCtCQTdCRSxXQUFXLHVDQThCWCxjQUFjLEVBQUUsRUFDaEIsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFlBQU0sQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEQsRUFDRDs7R0FDSDs7U0FuQ0csV0FBVztnQkFIVCxVQUFVOztRQTBDVixXQUFXLEdBQVgsV0FBVzs7Ozs7Ozs7OztBQ3hDbkIsTUFBTSxDQUFDLFFBQVEsR0FBRywwQkFGVixvQkFBb0IsRUFFZ0IsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0Jhc2VBY3Rpb259IGZyb20gJy4vYWN0aW9ucy9CYXNlQWN0aW9uJztcbmltcG9ydCB7TW9kYWxEaWFsb2d9IGZyb20gJy4vYWN0aW9ucy9Nb2RhbERpYWxvZyc7XG5cbmNsYXNzIFlpaTJBZG1pbkFwcGxpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZihwb2x5Z2xvdCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBhbmQgY29uZmlndXJlIGRldmdyb3VwL3lpaTItcG9seWdsb3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihnbG9iYWwubW9uc3RlcikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBmcm9udGVuZC1tb25zdGVyLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbnN0ZXIgPSBnbG9iYWwubW9uc3RlcjtcbiAgICB9XG4gICAgdGhpcy5iaW5kSGVscGVycygpO1xuICB9XG5cbiAgYmluZEhlbHBlcnMoKSB7XG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1hZG1pbi1hY3Rpb25dJywgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9ICQodGhpcyk7XG4gICAgICBjb25zdCBhY3Rpb25UeXBlID0gZWxlbWVudC5kYXRhKCdhZG1pbkFjdGlvbicpO1xuICAgICAgaWYgKGFjdGlvblR5cGUgPT09ICdNb2RhbERpYWxvZycpIHtcbiAgICAgICAgTW9kYWxEaWFsb2cuaW5zdGFuY2UoZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVsZW1lbnQuYXR0cignaHJlZicpIHx8IGVsZW1lbnQuY2xvc2VzdCgnZm9ybScpLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgQmFzZUFjdGlvbihlbmRwb2ludCk7XG4gICAgICAgIGFjdGlvbi5ydW4oW10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHdhcm4od2FybmluZ01lc3NhZ2UpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgaWYgKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2Fybih3YXJuaW5nTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YoYWxlcnQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhbGVydCh3YXJuaW5nTWVzc2FnZSk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9XG5cbiAgbW9kYWxOb3RpZmllcihtZXNzYWdlLCBjcml0aWNhbExldmVsKSB7XG4gICAgcmV0dXJuIHRoaXMubW9uc3Rlci5zaG93TW9kYWxOb3RpZmllcihtZXNzYWdlLCBjcml0aWNhbExldmVsKTtcbiAgfVxufVxuXG5leHBvcnQge1lpaTJBZG1pbkFwcGxpY2F0aW9ufTtcbiIsImNsYXNzIEJhc2VBY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCkge1xuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLm1ldGhvZCA9ICdQT1NUJztcbiAgICB0aGlzLm1vbnN0ZXJFcnJvck5vdGlmaWVyRnVuY3Rpb24gPSAnbW9kYWxOb3RpZmllcic7XG4gIH1cblxuICBzdGF0aWMgaW5zdGFuY2UoLi4ucmVzdCkge1xuICAgIHJldHVybiBuZXcgdGhpcyguLi5yZXN0KTtcbiAgfVxuXG4gIHJ1bihwYXJhbXMsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmFqYXhDYWxsKFxuICAgICAgcGFyYW1zLFxuICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgIC8vIHNob3cgYWxsIG5vdGlmaWNhdGlvbnMgZnJvbSBiYWNrZW5kXG4gICAgICAgIGlmIChkYXRhLm5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qgbm90aWZpY2F0aW9uIG9mIGRhdGEubm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgZ2xvYmFsLm1vbnN0ZXIuc2hvd0Jvb3RzdHJhcEJveE5vdGlmaWVyKG5vdGlmaWNhdGlvbi5tZXNzYWdlLCBub3RpZmljYXRpb24uY3JpdGljYWxMZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNhbGwgY29ycmVzcG9uZGluZyBjYWxsYmFja1xuICAgICAgICBpZiAoZGF0YS5lcnJvciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAoc3VjY2Vzc0NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soZGF0YS5jb250ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGVycm9yQ2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBnbG9iYWwubW9uc3Rlclt0aGlzLm1vbnN0ZXJFcnJvck5vdGlmaWVyRnVuY3Rpb25dKG1lc3NhZ2UsICdlcnJvcicpO1xuICB9XG5cbiAgYWpheENhbGwocGFyYW1zLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICByZXR1cm4gJC5hamF4KFxuICAgICAge1xuICAgICAgICB1cmw6IHRoaXMuZW5kcG9pbnQsXG4gICAgICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgICAgIGRhdGE6IHBhcmFtcyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgdGhpcy5zaG93RXJyb3JNZXNzYWdlKGVycm9yVGhyb3duKTtcbiAgICAgICAgICBlcnJvckNhbGxiYWNrKFtdLCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbmV4cG9ydCB7QmFzZUFjdGlvbn07XG4iLCJpbXBvcnQge0Jhc2VBY3Rpb259IGZyb20gJy4vQmFzZUFjdGlvbic7XG5pbXBvcnQge1lpaTJBZG1pbkFwcGxpY2F0aW9ufSBmcm9tICcuLi9ZaWkyQWRtaW5BcHBsaWNhdGlvbic7XG5cbmNsYXNzIE1vZGFsRGlhbG9nIGV4dGVuZHMgQmFzZUFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICBsZXQgZW5kcG9pbnQgPSAnJztcbiAgICBsZXQgcGFyYW1zQ2FsbGJhY2sgPSBudWxsO1xuICAgIGNvbnNvbGUubG9nKGVsZW1lbnRbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgc3dpdGNoIChlbGVtZW50WzBdLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdidXR0b24nOlxuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGNvbnN0IGZvcm0gPSBlbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKTtcbiAgICAgIHBhcmFtc0NhbGxiYWNrID0gZnVuY3Rpb24gcGFyYW1zKCkge1xuICAgICAgICByZXR1cm4gZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgfTtcbiAgICAgIGVuZHBvaW50ID0gZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2EnOlxuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7cmV0dXJuIFtdO307XG4gICAgICBlbmRwb2ludCA9IGVsZW1lbnQuYXR0cignaHJlZicpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIFlpaTJBZG1pbkFwcGxpY2F0aW9uLndhcm4oJ01vZGFsRGlhbG9nIGFjdGlvbiBleHBlY3RzIGVsZW1lbnQgb2YgdHlwZSBidXR0b24sIGlucHV0IG9yIGEgZm9yIGVuZHBvaW50IGRldGVjdGlvbicpO1xuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7XG4gICAgICAgIFlpaTJBZG1pbkFwcGxpY2F0aW9uLndhcm4oJ2RlZmF1bHQgcGFyYW1zQ2FsbGJhY2sgY2FsbGVkJyk7XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHN1cGVyKGVuZHBvaW50KTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICBzdXBlci5ydW4oXG4gICAgICBwYXJhbXNDYWxsYmFjaygpLFxuICAgICAgZnVuY3Rpb24gc3VjY2Vzcyhjb250ZW50KSB7XG4gICAgICAgIGdsb2JhbC5tb25zdGVyLnNob3dCb290c3RyYXBNb2RhbE5vdGlmaWVyKGNvbnRlbnQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxufVxuXG5leHBvcnQge01vZGFsRGlhbG9nfTtcbiIsImltcG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259IGZyb20gJy4vWWlpMkFkbWluQXBwbGljYXRpb24uanMnO1xuXG5nbG9iYWwuQWRtaW5BcHAgPSBuZXcgWWlpMkFkbWluQXBwbGljYXRpb24oKTtcblxuIl19
