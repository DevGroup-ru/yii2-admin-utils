(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  }

  _createClass(Yii2AdminApplication, [{
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

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _Yii2AdminApplication = require('./Yii2AdminApplication.js');

global.AdminApp = new _Yii2AdminApplication.Yii2AdminApplication();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Yii2AdminApplication.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0lDQU0sb0JBQW9CO0FBQ3hCLFdBREksb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9COztBQUV0QixRQUFJLE9BQU8sUUFBUSxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQ3BDLDBCQUFvQixDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0tBQ25GOztBQUVELFFBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQzFDLDBCQUFvQixDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0tBQy9ELE1BQU07QUFDTCxVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7S0FDL0I7R0FDRjs7ZUFYRyxvQkFBb0I7Ozs7a0NBdUJWLE9BQU8sRUFBRSxhQUFhLEVBQUU7QUFDcEMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztLQUMvRDs7O3lCQVpXLGNBQWMsRUFBRTs7QUFFMUIsVUFBSSxPQUFPLE9BQU8sQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUNuQyxlQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQzlCLE1BQU0sSUFBSSxPQUFPLEtBQUssQUFBQyxLQUFLLFVBQVUsRUFBRTtBQUN2QyxhQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDdkI7S0FFRjs7O1NBckJHLG9CQUFvQjs7O1FBNEJsQixvQkFBb0IsR0FBcEIsb0JBQW9COzs7Ozs7Ozs7O0FDMUI1QixNQUFNLENBQUMsUUFBUSxHQUFHLDBCQUZWLG9CQUFvQixFQUVnQixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIFlpaTJBZG1pbkFwcGxpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZihwb2x5Z2xvdCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBhbmQgY29uZmlndXJlIGRldmdyb3VwL3lpaTItcG9seWdsb3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihnbG9iYWwubW9uc3RlcikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBmcm9udGVuZC1tb25zdGVyLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbnN0ZXIgPSBnbG9iYWwubW9uc3RlcjtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgd2Fybih3YXJuaW5nTWVzc2FnZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihhbGVydCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFsZXJ0KHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH1cblxuICBtb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5tb25zdGVyLnNob3dNb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpO1xuICB9XG59XG5cbmV4cG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259O1xuIiwiaW1wb3J0IHtZaWkyQWRtaW5BcHBsaWNhdGlvbn0gZnJvbSAnLi9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyc7XG5cbmdsb2JhbC5BZG1pbkFwcCA9IG5ldyBZaWkyQWRtaW5BcHBsaWNhdGlvbigpO1xuXG4iXX0=
