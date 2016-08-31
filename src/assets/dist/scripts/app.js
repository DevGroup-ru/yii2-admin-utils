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
        var $this = $(this);
        switch ($this.data('action')) {
          case 'delete':
            var _$this$data = $this.data();

            var _$this$data$title = _$this$data.title;
            var title = _$this$data$title === undefined ? "Delete item?" : _$this$data$title;
            var _$this$data$text = _$this$data.text;
            var text = _$this$data$text === undefined ? "Are you sure you want to delete this item?" : _$this$data$text;
            var _$this$data$close = _$this$data.close;
            var close = _$this$data$close === undefined ? "Close" : _$this$data$close;
            var _$this$data$method = _$this$data.method;
            var method = _$this$data$method === undefined ? "post" : _$this$data$method;

            _DeleteConfirmation.DeleteConfirmation.instance($this, title, text, close, method);
            break;
          case 'delete-confirmation-yes':
            if ($this.data('method').toLowerCase() === 'post') {
              $.post($this.data('href')).done(function () {
                window.location.reload(true);
              }).error(function (error) {
                alert(error.status + ': ' + error.statusText);
                window.location.reload(true);
              });
            } else {
              window.location.href = $this.data('href');
            }
            break;
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
        var close = arguments.length <= 3 || arguments[3] === undefined ? "Close" : arguments[3];
        var method = arguments.length <= 4 || arguments[4] === undefined ? "post" : arguments[4];

        _classCallCheck(this, DeleteConfirmation);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeleteConfirmation).call(this, element, title, text, close));

        _this.href = element.attr('href');
        _this.method = method;
        return _this;
    }

    _createClass(DeleteConfirmation, [{
        key: "renderButtons",
        value: function renderButtons() {
            return " <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" + this.close + "</button>\n                        <a data-href=\"" + this.href + "\" data-method=\"" + this.method + "\" data-action=\"delete-confirmation-yes\" class=\"btn btn-warning\" class=\"btn btn-outline\">Ок</a>\n                      </div>";
        }
    }]);

    return DeleteConfirmation;
}(_BaseConfirmation2.BaseConfirmation);

exports.DeleteConfirmation = DeleteConfirmation;

},{"./BaseConfirmation":5}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FjdGlvbnMvQmFzZUFjdGlvbi5qcyIsImpzL2FjdGlvbnMvTW9kYWxEaWFsb2cuanMiLCJqcy9hcHAuanMiLCJqcy9jb25maXJtYXRpb25zL0Jhc2VDb25maXJtYXRpb24uanMiLCJqcy9jb25maXJtYXRpb25zL0RlbGV0ZUNvbmZpcm1hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7QUFDQTs7OztJQUdNLG9CO0FBQ0osa0NBQWM7QUFBQTs7QUFDWixRQUFJLE9BQU8sUUFBUCxLQUFxQixXQUF6QixFQUFzQztBQUNwQywyQkFBcUIsSUFBckIsQ0FBMEIsc0RBQTFCO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPLE9BQU8sT0FBZCxLQUEyQixXQUEvQixFQUE0QztBQUMxQywyQkFBcUIsSUFBckIsQ0FBMEIsa0NBQTFCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSyxPQUFMLEdBQWUsT0FBTyxPQUF0QjtBQUNEO0FBQ0QsU0FBSyxXQUFMO0FBQ0Q7Ozs7a0NBRWE7QUFDWixRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixxQkFBdEIsRUFBNkMsU0FBUyxZQUFULEdBQXdCO0FBQ25FLFlBQU0sVUFBVSxFQUFFLElBQUYsQ0FBaEI7QUFDQSxZQUFNLGFBQWEsUUFBUSxJQUFSLENBQWEsYUFBYixDQUFuQjtBQUNBLFlBQUksZUFBZSxhQUFuQixFQUFrQztBQUNoQyxtQ0FBWSxRQUFaLENBQXFCLE9BQXJCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBTSxXQUFXLFFBQVEsSUFBUixDQUFhLE1BQWIsS0FBd0IsUUFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLElBQXhCLENBQTZCLFFBQTdCLENBQXpDO0FBQ0EsY0FBTSxTQUFTLDJCQUFlLFFBQWYsQ0FBZjtBQUNBLGlC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WTtBQUNULDBKQUN1RixLQUFLLEtBRDVGLGtLQUkyQyxLQUFLLEtBSmhEO0FBTUg7OztxQ0FFWTtBQUNULDRFQUNrQixLQUFLLElBRHZCO0FBR0g7Ozt3Q0FFZTtBQUNaLHdKQUNxRixLQUFLLEtBRDFGO0FBR0g7Ozs4QkFFSztBQUNGLGNBQUUsS0FBSyxVQUFMLEVBQUYsRUFBcUIsS0FBckIsQ0FBMkIsTUFBM0I7QUFDSDs7O21DQXZDd0I7QUFBQSw4Q0FBTixJQUFNO0FBQU4sb0JBQU07QUFBQTs7QUFDckIsbUJBQU8sbUNBQUksSUFBSixnQkFBWSxJQUFaLE1BQWtCLEdBQWxCLEVBQVA7QUFDSDs7Ozs7O1FBd0NHLGdCLEdBQUEsZ0I7Ozs7Ozs7Ozs7OztBQ2xEUjs7Ozs7Ozs7SUFFTSxrQjs7O0FBQ0YsZ0NBQVksT0FBWixFQUE0SDtBQUFBLFlBQXZHLEtBQXVHLHlEQUFqRyxjQUFpRztBQUFBLFlBQWpGLElBQWlGLHlEQUE1RSw0Q0FBNEU7QUFBQSxZQUE5QixLQUE4Qix5REFBeEIsT0FBd0I7QUFBQSxZQUFmLE1BQWUseURBQVIsTUFBUTs7QUFBQTs7QUFBQSwwR0FDbEgsT0FEa0gsRUFDekcsS0FEeUcsRUFDbEcsSUFEa0csRUFDNUYsS0FENEY7O0FBRXhILGNBQUssSUFBTCxHQUFZLFFBQVEsSUFBUixDQUFhLE1BQWIsQ0FBWjtBQUNBLGNBQUssTUFBTCxHQUFjLE1BQWQ7QUFId0g7QUFJM0g7Ozs7d0NBRWU7QUFDWix3SkFDcUYsS0FBSyxLQUQxRiwwREFFZ0MsS0FBSyxJQUZyQyx5QkFFMkQsS0FBSyxNQUZoRTtBQUlIOzs7Ozs7UUFHRyxrQixHQUFBLGtCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7QmFzZUFjdGlvbn0gZnJvbSAnLi9hY3Rpb25zL0Jhc2VBY3Rpb24nO1xuaW1wb3J0IHtNb2RhbERpYWxvZ30gZnJvbSAnLi9hY3Rpb25zL01vZGFsRGlhbG9nJztcbmltcG9ydCB7RGVsZXRlQ29uZmlybWF0aW9ufSBmcm9tICcuL2NvbmZpcm1hdGlvbnMvRGVsZXRlQ29uZmlybWF0aW9uJztcblxuXG5jbGFzcyBZaWkyQWRtaW5BcHBsaWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0eXBlb2YocG9seWdsb3QpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignWW91IE1VU1Qgc2V0dXAgYW5kIGNvbmZpZ3VyZSBkZXZncm91cC95aWkyLXBvbHlnbG90LicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YoZ2xvYmFsLm1vbnN0ZXIpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignWW91IE1VU1Qgc2V0dXAgZnJvbnRlbmQtbW9uc3Rlci4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb25zdGVyID0gZ2xvYmFsLm1vbnN0ZXI7XG4gICAgfVxuICAgIHRoaXMuYmluZEhlbHBlcnMoKTtcbiAgfVxuXG4gIGJpbmRIZWxwZXJzKCkge1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtYWRtaW4tYWN0aW9uXScsIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcigpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGVsZW1lbnQuZGF0YSgnYWRtaW5BY3Rpb24nKTtcbiAgICAgIGlmIChhY3Rpb25UeXBlID09PSAnTW9kYWxEaWFsb2cnKSB7XG4gICAgICAgIE1vZGFsRGlhbG9nLmluc3RhbmNlKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlbGVtZW50LmF0dHIoJ2hyZWYnKSB8fCBlbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbmV3IEJhc2VBY3Rpb24oZW5kcG9pbnQpO1xuICAgICAgICBhY3Rpb24ucnVuKFtdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uXScsIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgc3dpdGNoICgkdGhpcy5kYXRhKCdhY3Rpb24nKSkge1xuICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgIGxldCB7dGl0bGU9XCJEZWxldGUgaXRlbT9cIiwgdGV4dD1cIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBpdGVtP1wiLCBjbG9zZT1cIkNsb3NlXCIsIG1ldGhvZD1cInBvc3RcIn0gPVxuICAgICAgICAgICAgICAkdGhpcy5kYXRhKCk7XG4gICAgICAgICAgRGVsZXRlQ29uZmlybWF0aW9uLmluc3RhbmNlKCR0aGlzLCB0aXRsZSwgdGV4dCwgY2xvc2UsIG1ldGhvZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbGV0ZS1jb25maXJtYXRpb24teWVzJzpcbiAgICAgICAgICBpZiAoJHRoaXMuZGF0YSgnbWV0aG9kJykudG9Mb3dlckNhc2UoKSA9PT0gJ3Bvc3QnKSB7XG4gICAgICAgICAgICAkLnBvc3QoJHRoaXMuZGF0YSgnaHJlZicpKVxuICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvci5zdGF0dXMgKyAnOiAnICsgZXJyb3Iuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJHRoaXMuZGF0YSgnaHJlZicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHdhcm4od2FybmluZ01lc3NhZ2UpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgaWYgKHR5cGVvZihjb25zb2xlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2Fybih3YXJuaW5nTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YoYWxlcnQpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhbGVydCh3YXJuaW5nTWVzc2FnZSk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9XG5cbiAgbW9kYWxOb3RpZmllcihtZXNzYWdlLCBjcml0aWNhbExldmVsKSB7XG4gICAgcmV0dXJuIHRoaXMubW9uc3Rlci5zaG93TW9kYWxOb3RpZmllcihtZXNzYWdlLCBjcml0aWNhbExldmVsKTtcbiAgfVxufVxuXG5leHBvcnQge1lpaTJBZG1pbkFwcGxpY2F0aW9ufTtcbiIsImNsYXNzIEJhc2VBY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCkge1xuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLm1ldGhvZCA9ICdQT1NUJztcbiAgICB0aGlzLm1vbnN0ZXJFcnJvck5vdGlmaWVyRnVuY3Rpb24gPSAnbW9kYWxOb3RpZmllcic7XG4gIH1cblxuICBzdGF0aWMgaW5zdGFuY2UoLi4ucmVzdCkge1xuICAgIHJldHVybiBuZXcgdGhpcyguLi5yZXN0KTtcbiAgfVxuXG4gIHJ1bihwYXJhbXMsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmFqYXhDYWxsKFxuICAgICAgcGFyYW1zLFxuICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgIC8vIHNob3cgYWxsIG5vdGlmaWNhdGlvbnMgZnJvbSBiYWNrZW5kXG4gICAgICAgIGlmIChkYXRhLm5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3Qgbm90aWZpY2F0aW9uIG9mIGRhdGEubm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgZ2xvYmFsLm1vbnN0ZXIuc2hvd0Jvb3RzdHJhcEJveE5vdGlmaWVyKG5vdGlmaWNhdGlvbi5tZXNzYWdlLCBub3RpZmljYXRpb24uY3JpdGljYWxMZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNhbGwgY29ycmVzcG9uZGluZyBjYWxsYmFja1xuICAgICAgICBpZiAoZGF0YS5lcnJvciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAoc3VjY2Vzc0NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soZGF0YS5jb250ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGVycm9yQ2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBnbG9iYWwubW9uc3Rlclt0aGlzLm1vbnN0ZXJFcnJvck5vdGlmaWVyRnVuY3Rpb25dKG1lc3NhZ2UsICdlcnJvcicpO1xuICB9XG5cbiAgYWpheENhbGwocGFyYW1zLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICByZXR1cm4gJC5hamF4KFxuICAgICAge1xuICAgICAgICB1cmw6IHRoaXMuZW5kcG9pbnQsXG4gICAgICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgICAgIGRhdGE6IHBhcmFtcyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgdGhpcy5zaG93RXJyb3JNZXNzYWdlKGVycm9yVGhyb3duKTtcbiAgICAgICAgICBlcnJvckNhbGxiYWNrKFtdLCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbmV4cG9ydCB7QmFzZUFjdGlvbn07XG4iLCJpbXBvcnQge0Jhc2VBY3Rpb259IGZyb20gJy4vQmFzZUFjdGlvbic7XG5pbXBvcnQge1lpaTJBZG1pbkFwcGxpY2F0aW9ufSBmcm9tICcuLi9ZaWkyQWRtaW5BcHBsaWNhdGlvbic7XG5cbmNsYXNzIE1vZGFsRGlhbG9nIGV4dGVuZHMgQmFzZUFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICBsZXQgZW5kcG9pbnQgPSAnJztcbiAgICBsZXQgcGFyYW1zQ2FsbGJhY2sgPSBudWxsO1xuICAgIGNvbnNvbGUubG9nKGVsZW1lbnRbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgc3dpdGNoIChlbGVtZW50WzBdLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdidXR0b24nOlxuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGNvbnN0IGZvcm0gPSBlbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKTtcbiAgICAgIHBhcmFtc0NhbGxiYWNrID0gZnVuY3Rpb24gcGFyYW1zKCkge1xuICAgICAgICByZXR1cm4gZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgfTtcbiAgICAgIGVuZHBvaW50ID0gZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2EnOlxuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7cmV0dXJuIFtdO307XG4gICAgICBlbmRwb2ludCA9IGVsZW1lbnQuYXR0cignaHJlZicpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIFlpaTJBZG1pbkFwcGxpY2F0aW9uLndhcm4oJ01vZGFsRGlhbG9nIGFjdGlvbiBleHBlY3RzIGVsZW1lbnQgb2YgdHlwZSBidXR0b24sIGlucHV0IG9yIGEgZm9yIGVuZHBvaW50IGRldGVjdGlvbicpO1xuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7XG4gICAgICAgIFlpaTJBZG1pbkFwcGxpY2F0aW9uLndhcm4oJ2RlZmF1bHQgcGFyYW1zQ2FsbGJhY2sgY2FsbGVkJyk7XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHN1cGVyKGVuZHBvaW50KTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICBzdXBlci5ydW4oXG4gICAgICBwYXJhbXNDYWxsYmFjaygpLFxuICAgICAgZnVuY3Rpb24gc3VjY2Vzcyhjb250ZW50KSB7XG4gICAgICAgIGdsb2JhbC5tb25zdGVyLnNob3dCb290c3RyYXBNb2RhbE5vdGlmaWVyKGNvbnRlbnQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxufVxuXG5leHBvcnQge01vZGFsRGlhbG9nfTtcbiIsImltcG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259IGZyb20gJy4vWWlpMkFkbWluQXBwbGljYXRpb24uanMnO1xuXG5nbG9iYWwuQWRtaW5BcHAgPSBuZXcgWWlpMkFkbWluQXBwbGljYXRpb24oKTtcblxuIiwiY2xhc3MgQmFzZUNvbmZpcm1hdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCB0aXRsZSA9IFwiVGl0bGVcIiwgdGV4dCA9IFwiVGV4dFwiLCBjbG9zZSA9IFwiY2xvc2VcIikge1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuY2xvc2UgPSBjbG9zZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW5zdGFuY2UoLi4ucmVzdCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoLi4ucmVzdCkucnVuKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyRm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5yZW5kZXJIZWFkKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMucmVuZGVyQm9keSgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnJlbmRlckJ1dHRvbnMoKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIHJlbmRlckhlYWQoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIiR7dGhpcy5jbG9zZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgPiR7dGhpcy50aXRsZX08L2g0PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgcmVuZGVyQm9keSgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnRleHR9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICByZW5kZXJCdXR0b25zKCkge1xuICAgICAgICByZXR1cm4gYCA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JHt0aGlzLmNsb3NlfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgICAkKHRoaXMucmVuZGVyRm9ybSgpKS5tb2RhbCgnc2hvdycpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtCYXNlQ29uZmlybWF0aW9ufTtcbiIsImltcG9ydCB7QmFzZUNvbmZpcm1hdGlvbn0gZnJvbSAnLi9CYXNlQ29uZmlybWF0aW9uJztcblxuY2xhc3MgRGVsZXRlQ29uZmlybWF0aW9uIGV4dGVuZHMgQmFzZUNvbmZpcm1hdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgdGl0bGU9XCJEZWxldGUgaXRlbT9cIiwgdGV4dD1cIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBpdGVtP1wiLCBjbG9zZT1cIkNsb3NlXCIsIG1ldGhvZD1cInBvc3RcIikge1xuICAgICAgICBzdXBlcihlbGVtZW50LCB0aXRsZSwgdGV4dCwgY2xvc2UpO1xuICAgICAgICB0aGlzLmhyZWYgPSBlbGVtZW50LmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuXG4gICAgcmVuZGVyQnV0dG9ucygpIHtcbiAgICAgICAgcmV0dXJuIGAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiR7dGhpcy5jbG9zZX08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGRhdGEtaHJlZj1cIiR7dGhpcy5ocmVmfVwiIGRhdGEtbWV0aG9kPVwiJHt0aGlzLm1ldGhvZH1cIiBkYXRhLWFjdGlvbj1cImRlbGV0ZS1jb25maXJtYXRpb24teWVzXCIgY2xhc3M9XCJidG4gYnRuLXdhcm5pbmdcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZVwiPtCe0Lo8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG59XG5cbmV4cG9ydCB7RGVsZXRlQ29uZmlybWF0aW9ufTtcbiJdfQ==
