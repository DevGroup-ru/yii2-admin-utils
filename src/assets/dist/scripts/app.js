(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Yii2AdminApplication = undefined;

var _ModalNotifier = require('./notifiers/ModalNotifier.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Yii2AdminApplication = (function () {
  function Yii2AdminApplication() {
    _classCallCheck(this, Yii2AdminApplication);

    if (typeof polyglot === 'undefined') {
      var warningMessage = 'You MUST setup and configure devgroup/yii2-polyglot.';
      /*eslint-disable */
      if (typeof console !== 'undefined') {
        console.warn(warningMessage);
      } else if (typeof alert === 'function') {
        alert(warningMessage);
      }
      /*eslint-enable */
    }
  }

  _createClass(Yii2AdminApplication, null, [{
    key: 'modalNotifier',
    value: function modalNotifier(message, criticalLevel) {
      return new _ModalNotifier.ModalNotifier(message, criticalLevel);
    }
  }]);

  return Yii2AdminApplication;
})();

exports.Yii2AdminApplication = Yii2AdminApplication;

},{"./notifiers/ModalNotifier.js":4}],2:[function(require,module,exports){
(function (global){
'use strict';

var _Yii2AdminApplication = require('./Yii2AdminApplication.js');

global.AdminApp = new _Yii2AdminApplication.Yii2AdminApplication();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Yii2AdminApplication.js":1}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionNotifier = (function () {
  function ActionNotifier() {
    _classCallCheck(this, ActionNotifier);
  }

  _createClass(ActionNotifier, [{
    key: 'construct',
    value: function construct(message, criticalLevel) {
      this.message = message;
      this.criticalLevel = criticalLevel;
    }
  }, {
    key: 'criticalLevelModifier',
    get: function get() {
      return ['error', 'warning', 'info', 'success'].indexOf(this.criticalLevel) ? '--' + this.criticalLevel : '';
    }
  }]);

  return ActionNotifier;
})();

exports.ActionNotifier = ActionNotifier;

},{}],4:[function(require,module,exports){
'use strict';

function _typeof27(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _typeof26(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof27(obj);
}

function _typeof25(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof26(obj);
}

function _typeof24(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof25(obj);
}

function _typeof23(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof24(obj);
}

function _typeof22(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof23(obj);
}

function _typeof21(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof22(obj);
}

function _typeof20(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof21(obj);
}

function _typeof19(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof20(obj);
}

function _typeof18(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof19(obj);
}

function _typeof17(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof18(obj);
}

function _typeof16(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof17(obj);
}

function _typeof15(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof16(obj);
}

function _typeof14(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof15(obj);
}

function _typeof13(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof14(obj);
}

function _typeof12(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof13(obj);
}

function _typeof11(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof12(obj);
}

function _typeof10(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof11(obj);
}

function _typeof9(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof10(obj);
}

function _typeof8(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof9(obj);
}

function _typeof7(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof8(obj);
}

function _typeof6(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof7(obj);
}

function _typeof5(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof6(obj);
}

function _typeof4(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof5(obj);
}

function _typeof3(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof4(obj);
}

function _typeof2(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalNotifier = undefined;

var _ActionNotifier2 = require('./ActionNotifier.js');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ModalNotifier = (function (_ActionNotifier) {
  _inherits(ModalNotifier, _ActionNotifier);

  function ModalNotifier(message, criticalLevel) {
    _classCallCheck(this, ModalNotifier);

    // add element

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModalNotifier).call(this, message, criticalLevel));

    var modalElement = $('<div>');
    var i18nClose = polyglot.t('modal.close');
    var closeButton = $('<button class="yii2admin-modal__close-button">' + i18nClose + '</button>');

    return _possibleConstructorReturn(_this, modalElement.addClass('yii2admin-modal--notification' + _this.criticalLevelModifier()).append(closeButton).popup({
      autoopen: true
    }));
  }

  return ModalNotifier;
})(_ActionNotifier2.ActionNotifier);

exports.ModalNotifier = ModalNotifier;

},{"./ActionNotifier.js":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FwcC5qcyIsImpzL25vdGlmaWVycy9BY3Rpb25Ob3RpZmllci5qcyIsImpzL25vdGlmaWVycy9Nb2RhbE5vdGlmaWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztJQ0VNLG9CQUFvQjtBQUN4QixXQURJLG9CQUFvQixHQUNWOzBCQURWLG9CQUFvQjs7QUFFdEIsUUFBSSxPQUFPLFFBQVEsQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUNwQyxVQUFNLGNBQWMsR0FBRyxzREFBc0Q7O0FBQUMsQUFFOUUsVUFBSSxPQUFPLE9BQU8sQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUNuQyxlQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQzlCLE1BQU0sSUFBSSxPQUFPLEtBQUssQUFBQyxLQUFLLFVBQVUsRUFBRTtBQUN2QyxhQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDdkI7O0FBQUEsS0FFRjtHQUNGOztlQVpHLG9CQUFvQjs7a0NBY0gsT0FBTyxFQUFFLGFBQWEsRUFBRTtBQUMzQyxhQUFPLG1CQWpCSCxhQUFhLENBaUJRLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztLQUNsRDs7O1NBaEJHLG9CQUFvQjs7O1FBbUJsQixvQkFBb0IsR0FBcEIsb0JBQW9COzs7Ozs7OztBQ25CNUIsTUFBTSxDQUFDLFFBQVEsR0FBRywwQkFGVixvQkFBb0IsRUFFZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0lDRnZDLGNBQWM7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OztlQUFkLGNBQWM7OzhCQUNSLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDaEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7S0FDcEM7Ozt3QkFFMkI7QUFDMUIsYUFBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVEsSUFBSSxDQUFDLGFBQWEsR0FBSyxFQUFFLENBQUM7S0FDN0c7OztTQVJHLGNBQWM7OztRQVVaLGNBQWMsR0FBZCxjQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDUmhCLGFBQWE7WUFBYixhQUFhLG1CQUNqQjs7V0FESSxhQUFhLENBQ0wsT0FBTyxFQUFFLGFBQWEsRUFBRTswQkFEaEMsYUFBYTs7Ozt1RUFBYixhQUFhLGFBRVQsT0FBTyxFQUFFLGFBQWEsR0FHNUI7O1FBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxBQUNoQztRQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEFBQzVDO1FBQU0sV0FBVyxHQUFHLENBQUMsb0RBQWtELFNBQVMsZUFBWSxDQUFDLEFBRTdGOzs2Q0FBTyxZQUFZLENBQ2hCLFFBQVEsbUNBQWlDLE1BQUsscUJBQXFCLEVBQUUsQ0FBRyxDQUN4RSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQ25CLEtBQUssQ0FBQyxBQUNMO2NBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxFQUFDO0dBQ047O1NBZkcsYUFBYTtvQkFGWCxjQUFjOztRQW9CZCxhQUFhLEdBQWIsYUFBYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge01vZGFsTm90aWZpZXJ9IGZyb20gJy4vbm90aWZpZXJzL01vZGFsTm90aWZpZXIuanMnO1xuXG5jbGFzcyBZaWkyQWRtaW5BcHBsaWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0eXBlb2YocG9seWdsb3QpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3Qgd2FybmluZ01lc3NhZ2UgPSAnWW91IE1VU1Qgc2V0dXAgYW5kIGNvbmZpZ3VyZSBkZXZncm91cC95aWkyLXBvbHlnbG90Lic7XG4gICAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YoYWxlcnQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGFsZXJ0KHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBtb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICByZXR1cm4gbmV3IE1vZGFsTm90aWZpZXIobWVzc2FnZSwgY3JpdGljYWxMZXZlbCk7XG4gIH1cbn1cblxuZXhwb3J0IHtZaWkyQWRtaW5BcHBsaWNhdGlvbn07XG4iLCJpbXBvcnQge1lpaTJBZG1pbkFwcGxpY2F0aW9ufSBmcm9tICcuL1lpaTJBZG1pbkFwcGxpY2F0aW9uLmpzJztcblxuZ2xvYmFsLkFkbWluQXBwID0gbmV3IFlpaTJBZG1pbkFwcGxpY2F0aW9uKCk7XG5cbiIsImNsYXNzIEFjdGlvbk5vdGlmaWVyIHtcbiAgY29uc3RydWN0KG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuY3JpdGljYWxMZXZlbCA9IGNyaXRpY2FsTGV2ZWw7XG4gIH1cblxuICBnZXQgY3JpdGljYWxMZXZlbE1vZGlmaWVyKCkge1xuICAgIHJldHVybiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdzdWNjZXNzJ10uaW5kZXhPZih0aGlzLmNyaXRpY2FsTGV2ZWwpID8gYC0tJHt0aGlzLmNyaXRpY2FsTGV2ZWx9YCA6ICcnO1xuICB9XG59XG5leHBvcnQge0FjdGlvbk5vdGlmaWVyfTtcbiIsImltcG9ydCB7QWN0aW9uTm90aWZpZXJ9IGZyb20gJy4vQWN0aW9uTm90aWZpZXIuanMnO1xuXG5jbGFzcyBNb2RhbE5vdGlmaWVyIGV4dGVuZHMgQWN0aW9uTm90aWZpZXIge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjcml0aWNhbExldmVsKSB7XG4gICAgc3VwZXIobWVzc2FnZSwgY3JpdGljYWxMZXZlbCk7XG5cbiAgICAvLyBhZGQgZWxlbWVudFxuICAgIGNvbnN0IG1vZGFsRWxlbWVudCA9ICQoJzxkaXY+Jyk7XG4gICAgY29uc3QgaTE4bkNsb3NlID0gcG9seWdsb3QudCgnbW9kYWwuY2xvc2UnKTtcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9ICQoYDxidXR0b24gY2xhc3M9XCJ5aWkyYWRtaW4tbW9kYWxfX2Nsb3NlLWJ1dHRvblwiPiR7aTE4bkNsb3NlfTwvYnV0dG9uPmApO1xuXG4gICAgcmV0dXJuIG1vZGFsRWxlbWVudFxuICAgICAgLmFkZENsYXNzKGB5aWkyYWRtaW4tbW9kYWwtLW5vdGlmaWNhdGlvbiR7dGhpcy5jcml0aWNhbExldmVsTW9kaWZpZXIoKX1gKVxuICAgICAgLmFwcGVuZChjbG9zZUJ1dHRvbilcbiAgICAgIC5wb3B1cCh7XG4gICAgICAgIGF1dG9vcGVuOiB0cnVlLFxuICAgICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHtNb2RhbE5vdGlmaWVyfTtcbiJdfQ==
