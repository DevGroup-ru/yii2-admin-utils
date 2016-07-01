(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Yii2AdminApplication = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseAction = require('./actions/BaseAction');

var _ModalDialog = require('./actions/ModalDialog');

var _DeleteConfirmation = require('./confirmations/DeleteConfirmation');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Yii2AdminApplication = function () {
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

      $('body').on('click', '[data-action]', function () {
        if ($(this).data('action') === 'delete') {
          var _$$data = $(this).data();

          var _$$data$title = _$$data.title;
          var title = _$$data$title === undefined ? "Delete item?" : _$$data$title;
          var _$$data$text = _$$data.text;
          var text = _$$data$text === undefined ? "Are you sure you want to delete this item?" : _$$data$text;
          var _$$data$close = _$$data.close;
          var close = _$$data$close === undefined ? "close" : _$$data$close;

          _DeleteConfirmation.DeleteConfirmation.instance($(this), title, text, close);
        }
        return false;
      });
    }
  }, {
    key: 'modalNotifier',
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
      /*eslint-enable */
    }
  }]);

  return Yii2AdminApplication;
}();

exports.Yii2AdminApplication = Yii2AdminApplication;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./actions/BaseAction":2,"./actions/ModalDialog":3,"./confirmations/DeleteConfirmation":6}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseAction = function () {
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
}();

exports.BaseAction = BaseAction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalDialog = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseAction2 = require('./BaseAction');

var _Yii2AdminApplication = require('../Yii2AdminApplication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalDialog = function (_BaseAction) {
  _inherits(ModalDialog, _BaseAction);

  function ModalDialog(element) {
    _classCallCheck(this, ModalDialog);

    var endpoint = '';
    var paramsCallback = null;
    console.log(element[0].nodeName.toLowerCase());

    (function () {
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
    })();

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModalDialog).call(this, endpoint));

    _this.element = element;

    _get(Object.getPrototypeOf(ModalDialog.prototype), 'run', _this).call(_this, paramsCallback(), function success(content) {
      global.monster.showBootstrapModalNotifier(content);
    });
    return _this;
  }

  return ModalDialog;
}(_BaseAction2.BaseAction);

exports.ModalDialog = ModalDialog;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../Yii2AdminApplication":1,"./BaseAction":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var _Yii2AdminApplication = require('./Yii2AdminApplication.js');

global.AdminApp = new _Yii2AdminApplication.Yii2AdminApplication();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Yii2AdminApplication.js":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseConfirmation = function () {
    function BaseConfirmation(element) {
        var title = arguments.length <= 1 || arguments[1] === undefined ? "Title" : arguments[1];
        var text = arguments.length <= 2 || arguments[2] === undefined ? "Text" : arguments[2];
        var close = arguments.length <= 3 || arguments[3] === undefined ? "close" : arguments[3];

        _classCallCheck(this, BaseConfirmation);

        this.title = title;
        this.text = text;
        this.close = close;
    }

    _createClass(BaseConfirmation, [{
        key: "renderForm",
        value: function renderForm() {
            return "<div class=\"modal fade\" role=\"dialog\" aria-hidden=\"true\">\n                  <div class=\"modal-dialog\" role=\"document\">\n                    <div class=\"modal-content\">\n                        " + this.renderHead() + "\n                        " + this.renderBody() + "\n                        " + this.renderButtons() + "\n                    </div>\n                  </div>\n                </div>";
        }
    }, {
        key: "renderHead",
        value: function renderHead() {
            return "<div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"" + this.close + "\">\n                          <span aria-hidden=\"true\">×</span>\n                        </button>\n                        <h4 class=\"modal-title\" >" + this.title + "</h4>\n                      </div>";
        }
    }, {
        key: "renderBody",
        value: function renderBody() {
            return "<div class=\"modal-body\">\n                        " + this.text + "\n                      </div>";
        }
    }, {
        key: "renderButtons",
        value: function renderButtons() {
            return " <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" + this.close + "</button>\n                      </div>";
        }
    }, {
        key: "run",
        value: function run() {
            $(this.renderForm()).modal('show');
        }
    }], [{
        key: "instance",
        value: function instance() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(this, [null].concat(rest)))().run();
        }
    }]);

    return BaseConfirmation;
}();

exports.BaseConfirmation = BaseConfirmation;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeleteConfirmation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseConfirmation2 = require("./BaseConfirmation");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteConfirmation = function (_BaseConfirmation) {
    _inherits(DeleteConfirmation, _BaseConfirmation);

    function DeleteConfirmation(element) {
        var title = arguments.length <= 1 || arguments[1] === undefined ? "Delete item?" : arguments[1];
        var text = arguments.length <= 2 || arguments[2] === undefined ? "Are you sure you want to delete this item?" : arguments[2];
        var close = arguments.length <= 3 || arguments[3] === undefined ? "close" : arguments[3];

        _classCallCheck(this, DeleteConfirmation);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteConfirmation).call(this, element, title, text, close));

        _this.href = element.attr('href');
        return _this;
    }

    _createClass(DeleteConfirmation, [{
        key: "renderButtons",
        value: function renderButtons() {
            return " <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" + this.close + "</button>\n                        <a href=\"" + this.href + "\" class=\"btn btn-warning\" class=\"btn btn-outline\">Ок</a>\n                      </div>";
        }
    }]);

    return DeleteConfirmation;
}(_BaseConfirmation2.BaseConfirmation);

exports.DeleteConfirmation = DeleteConfirmation;

},{"./BaseConfirmation":5}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FjdGlvbnMvQmFzZUFjdGlvbi5qcyIsImpzL2FjdGlvbnMvTW9kYWxEaWFsb2cuanMiLCJqcy9hcHAuanMiLCJqcy9jb25maXJtYXRpb25zL0Jhc2VDb25maXJtYXRpb24uanMiLCJqcy9jb25maXJtYXRpb25zL0RlbGV0ZUNvbmZpcm1hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7QUFDQTs7OztJQUdNLG9CO0FBQ0osa0NBQWM7QUFBQTs7QUFDWixRQUFJLE9BQU8sUUFBUCxLQUFxQixXQUF6QixFQUFzQztBQUNwQywyQkFBcUIsSUFBckIsQ0FBMEIsc0RBQTFCO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPLE9BQU8sT0FBZCxLQUEyQixXQUEvQixFQUE0QztBQUMxQywyQkFBcUIsSUFBckIsQ0FBMEIsa0NBQTFCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSyxPQUFMLEdBQWUsT0FBTyxPQUF0QjtBQUNEO0FBQ0QsU0FBSyxXQUFMO0FBQ0Q7Ozs7a0NBRWE7QUFDWixRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixxQkFBdEIsRUFBNkMsU0FBUyxZQUFULEdBQXdCO0FBQ25FLFlBQU0sVUFBVSxFQUFFLElBQUYsQ0FBaEI7QUFDQSxZQUFNLGFBQWEsUUFBUSxJQUFSLENBQWEsYUFBYixDQUFuQjtBQUNBLFlBQUksZUFBZSxhQUFuQixFQUFrQztBQUNoQyxtQ0FBWSxRQUFaLENBQXFCLE9BQXJCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBTSxXQUFXLFFBQVEsSUFBUixDQUFhLE1BQWIsS0FBd0IsUUFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLElBQXhCLENBQTZCLFFBQTdCLENBQXpDO0FBQ0EsY0FBTSxTQUFTLDJCQUFlLFFBQWYsQ0FBZjtBQUNBLGlC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LEVBQ25GLElBRG1GLEVBQzdFLEtBRDZFOztBQUV6RyxjQUFLLElBQUwsR0FBWSxRQUFRLElBQVIsQ0FBYSxNQUFiLENBQVo7QUFGeUc7QUFHNUc7Ozs7d0NBRWU7QUFDWix3SkFDcUYsS0FBSyxLQUQxRixxREFFMkIsS0FBSyxJQUZoQztBQUlIOzs7Ozs7UUFHRyxrQixHQUFBLGtCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7QmFzZUFjdGlvbn0gZnJvbSAnLi9hY3Rpb25zL0Jhc2VBY3Rpb24nO1xuaW1wb3J0IHtNb2RhbERpYWxvZ30gZnJvbSAnLi9hY3Rpb25zL01vZGFsRGlhbG9nJztcbmltcG9ydCB7RGVsZXRlQ29uZmlybWF0aW9ufSBmcm9tICcuL2NvbmZpcm1hdGlvbnMvRGVsZXRlQ29uZmlybWF0aW9uJztcblxuXG5jbGFzcyBZaWkyQWRtaW5BcHBsaWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0eXBlb2YocG9seWdsb3QpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignWW91IE1VU1Qgc2V0dXAgYW5kIGNvbmZpZ3VyZSBkZXZncm91cC95aWkyLXBvbHlnbG90LicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YoZ2xvYmFsLm1vbnN0ZXIpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignWW91IE1VU1Qgc2V0dXAgZnJvbnRlbmQtbW9uc3Rlci4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb25zdGVyID0gZ2xvYmFsLm1vbnN0ZXI7XG4gICAgfVxuICAgIHRoaXMuYmluZEhlbHBlcnMoKTtcbiAgfVxuXG4gIGJpbmRIZWxwZXJzKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtYWRtaW4tYWN0aW9uXScsIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcigpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGVsZW1lbnQuZGF0YSgnYWRtaW5BY3Rpb24nKTtcbiAgICAgIGlmIChhY3Rpb25UeXBlID09PSAnTW9kYWxEaWFsb2cnKSB7XG4gICAgICAgIE1vZGFsRGlhbG9nLmluc3RhbmNlKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlbGVtZW50LmF0dHIoJ2hyZWYnKSB8fCBlbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbmV3IEJhc2VBY3Rpb24oZW5kcG9pbnQpO1xuICAgICAgICBhY3Rpb24ucnVuKFtdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uXScsIGZ1bmN0aW9uKCl7XG4gICAgICBpZigkKHRoaXMpLmRhdGEoJ2FjdGlvbicpID09PSAnZGVsZXRlJyl7XG5cbiAgICAgICAgbGV0IHt0aXRsZT1cIkRlbGV0ZSBpdGVtP1wiLCB0ZXh0PVwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGl0ZW0/XCIsIGNsb3NlPVwiY2xvc2VcIn0gPSAkKHRoaXMpLmRhdGEoKTtcbiAgICAgICAgRGVsZXRlQ29uZmlybWF0aW9uLmluc3RhbmNlKCQodGhpcyksIHRpdGxlLCB0ZXh0LCBjbG9zZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgd2Fybih3YXJuaW5nTWVzc2FnZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihhbGVydCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFsZXJ0KHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH1cblxuICBtb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5tb25zdGVyLnNob3dNb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpO1xuICB9XG59XG5cbmV4cG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259O1xuIiwiY2xhc3MgQmFzZUFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMubWV0aG9kID0gJ1BPU1QnO1xuICAgIHRoaXMubW9uc3RlckVycm9yTm90aWZpZXJGdW5jdGlvbiA9ICdtb2RhbE5vdGlmaWVyJztcbiAgfVxuXG4gIHN0YXRpYyBpbnN0YW5jZSguLi5yZXN0KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xuICB9XG5cbiAgcnVuKHBhcmFtcywgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuYWpheENhbGwoXG4gICAgICBwYXJhbXMsXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgLy8gc2hvdyBhbGwgbm90aWZpY2F0aW9ucyBmcm9tIGJhY2tlbmRcbiAgICAgICAgaWYgKGRhdGEubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBub3RpZmljYXRpb24gb2YgZGF0YS5ub3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgICBnbG9iYWwubW9uc3Rlci5zaG93Qm9vdHN0cmFwQm94Tm90aWZpZXIobm90aWZpY2F0aW9uLm1lc3NhZ2UsIG5vdGlmaWNhdGlvbi5jcml0aWNhbExldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2FsbCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrXG4gICAgICAgIGlmIChkYXRhLmVycm9yID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChzdWNjZXNzQ2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjayhkYXRhLmNvbnRlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZXJyb3JDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgc2hvd0Vycm9yTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5tb25zdGVyW3RoaXMubW9uc3RlckVycm9yTm90aWZpZXJGdW5jdGlvbl0obWVzc2FnZSwgJ2Vycm9yJyk7XG4gIH1cblxuICBhamF4Q2FsbChwYXJhbXMsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHJldHVybiAkLmFqYXgoXG4gICAgICB7XG4gICAgICAgIHVybDogdGhpcy5lbmRwb2ludCxcbiAgICAgICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UoZXJyb3JUaHJvd24pO1xuICAgICAgICAgIGVycm9yQ2FsbGJhY2soW10sIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IHtCYXNlQWN0aW9ufTtcbiIsImltcG9ydCB7QmFzZUFjdGlvbn0gZnJvbSAnLi9CYXNlQWN0aW9uJztcbmltcG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259IGZyb20gJy4uL1lpaTJBZG1pbkFwcGxpY2F0aW9uJztcblxuY2xhc3MgTW9kYWxEaWFsb2cgZXh0ZW5kcyBCYXNlQWN0aW9uIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIGxldCBlbmRwb2ludCA9ICcnO1xuICAgIGxldCBwYXJhbXNDYWxsYmFjayA9IG51bGw7XG4gICAgY29uc29sZS5sb2coZWxlbWVudFswXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICBzd2l0Y2ggKGVsZW1lbnRbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2J1dHRvbic6XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgY29uc3QgZm9ybSA9IGVsZW1lbnQuY2xvc2VzdCgnZm9ybScpO1xuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7XG4gICAgICAgIHJldHVybiBmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgICB9O1xuICAgICAgZW5kcG9pbnQgPSBmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYSc6XG4gICAgICBwYXJhbXNDYWxsYmFjayA9IGZ1bmN0aW9uIHBhcmFtcygpIHtyZXR1cm4gW107fTtcbiAgICAgIGVuZHBvaW50ID0gZWxlbWVudC5hdHRyKCdocmVmJyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignTW9kYWxEaWFsb2cgYWN0aW9uIGV4cGVjdHMgZWxlbWVudCBvZiB0eXBlIGJ1dHRvbiwgaW5wdXQgb3IgYSBmb3IgZW5kcG9pbnQgZGV0ZWN0aW9uJyk7XG4gICAgICBwYXJhbXNDYWxsYmFjayA9IGZ1bmN0aW9uIHBhcmFtcygpIHtcbiAgICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignZGVmYXVsdCBwYXJhbXNDYWxsYmFjayBjYWxsZWQnKTtcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc3VwZXIoZW5kcG9pbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIHN1cGVyLnJ1bihcbiAgICAgIHBhcmFtc0NhbGxiYWNrKCksXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGNvbnRlbnQpIHtcbiAgICAgICAgZ2xvYmFsLm1vbnN0ZXIuc2hvd0Jvb3RzdHJhcE1vZGFsTm90aWZpZXIoY29udGVudCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7TW9kYWxEaWFsb2d9O1xuIiwiaW1wb3J0IHtZaWkyQWRtaW5BcHBsaWNhdGlvbn0gZnJvbSAnLi9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyc7XG5cbmdsb2JhbC5BZG1pbkFwcCA9IG5ldyBZaWkyQWRtaW5BcHBsaWNhdGlvbigpO1xuXG4iLCJjbGFzcyBCYXNlQ29uZmlybWF0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRpdGxlID0gXCJUaXRsZVwiLCB0ZXh0ID0gXCJUZXh0XCIsIGNsb3NlID0gXCJjbG9zZVwiKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5jbG9zZSA9IGNsb3NlO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnN0YW5jZSguLi5yZXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyguLi5yZXN0KS5ydW4oKTtcbiAgICB9XG5cbiAgICByZW5kZXJGb3JtKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnJlbmRlckhlYWQoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5yZW5kZXJCb2R5KCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMucmVuZGVyQnV0dG9ucygpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgcmVuZGVySGVhZCgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiJHt0aGlzLmNsb3NlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiA+JHt0aGlzLnRpdGxlfTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICByZW5kZXJCb2R5KCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIHJlbmRlckJ1dHRvbnMoKSB7XG4gICAgICAgIHJldHVybiBgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4ke3RoaXMuY2xvc2V9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICAgICQodGhpcy5yZW5kZXJGb3JtKCkpLm1vZGFsKCdzaG93Jyk7XG4gICAgfVxufVxuXG5leHBvcnQge0Jhc2VDb25maXJtYXRpb259O1xuIiwiaW1wb3J0IHtCYXNlQ29uZmlybWF0aW9ufSBmcm9tICcuL0Jhc2VDb25maXJtYXRpb24nO1xuXG5jbGFzcyBEZWxldGVDb25maXJtYXRpb24gZXh0ZW5kcyBCYXNlQ29uZmlybWF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCB0aXRsZT1cIkRlbGV0ZSBpdGVtP1wiLCB0ZXh0PVwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGl0ZW0/XCIsIGNsb3NlPVwiY2xvc2VcIikge1xuICAgICAgICBzdXBlcihlbGVtZW50LCB0aXRsZSwgdGV4dCwgY2xvc2UpO1xuICAgICAgICB0aGlzLmhyZWYgPSBlbGVtZW50LmF0dHIoJ2hyZWYnKTtcbiAgICB9XG5cbiAgICByZW5kZXJCdXR0b25zKCkge1xuICAgICAgICByZXR1cm4gYCA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JHt0aGlzLmNsb3NlfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dGhpcy5ocmVmfVwiIGNsYXNzPVwiYnRuIGJ0bi13YXJuaW5nXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIj7QntC6PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxufVxuXG5leHBvcnQge0RlbGV0ZUNvbmZpcm1hdGlvbn07XG4iXX0=
