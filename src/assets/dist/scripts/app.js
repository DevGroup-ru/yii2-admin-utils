(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Yii2AdminApplication = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _BaseAction = require('./actions/BaseAction');

var _ModalDialog = require('./actions/ModalDialog');

var _DeleteConfirmation = require('./confirmations/DeleteConfirmation');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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

var _typeof9 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof8 = typeof Symbol === "function" && _typeof9(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof9(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof9(obj);
};

var _typeof7 = typeof Symbol === "function" && _typeof8(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof8(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof8(obj);
};

var _typeof6 = typeof Symbol === "function" && _typeof7(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof7(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof7(obj);
};

var _typeof5 = typeof Symbol === "function" && _typeof6(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof6(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof6(obj);
};

var _typeof4 = typeof Symbol === "function" && _typeof5(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof5(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof5(obj);
};

var _typeof3 = typeof Symbol === "function" && _typeof4(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof4(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof4(obj);
};

var _typeof2 = typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeleteConfirmation = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _BaseConfirmation2 = require("./BaseConfirmation");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyIsImpzL2FjdGlvbnMvQmFzZUFjdGlvbi5qcyIsImpzL2FjdGlvbnMvTW9kYWxEaWFsb2cuanMiLCJqcy9hcHAuanMiLCJqcy9jb25maXJtYXRpb25zL0Jhc2VDb25maXJtYXRpb24uanMiLCJqcy9jb25maXJtYXRpb25zL0RlbGV0ZUNvbmZpcm1hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBOztBQUNBOztBQUNBOzs7Ozs7OztJLEFBR00sbUNBQ0o7a0NBQWM7MEJBQ1o7O1FBQUksT0FBQSxBQUFPLGFBQVgsQUFBeUIsYUFBYSxBQUNwQzsyQkFBQSxBQUFxQixLQUFyQixBQUEwQixBQUMzQixBQUVEOzs7UUFBSSxPQUFPLE9BQVAsQUFBYyxZQUFsQixBQUErQixhQUFhLEFBQzFDOzJCQUFBLEFBQXFCLEtBRHZCLEFBQ0UsQUFBMEIsQUFDM0I7V0FBTSxBQUNMO1dBQUEsQUFBSyxVQUFVLE9BQWYsQUFBc0IsQUFDdkIsQUFDRDs7U0FBQSxBQUFLLEFBQ047Ozs7O2tDQUVhLEFBQ1o7UUFBQSxBQUFFLFFBQUYsQUFBVSxHQUFWLEFBQWEsU0FBYixBQUFzQix1QkFBdUIsU0FBQSxBQUFTLGVBQWUsQUFDbkU7WUFBTSxVQUFVLEVBQWhCLEFBQWdCLEFBQUUsQUFDbEI7WUFBTSxhQUFhLFFBQUEsQUFBUSxLQUEzQixBQUFtQixBQUFhLEFBQ2hDO1lBQUksZUFBSixBQUFtQixlQUFlLEFBQ2hDO21DQUFBLEFBQVksU0FEZCxBQUNFLEFBQXFCLEFBQ3RCO2VBQU0sQUFDTDtjQUFNLFdBQVcsUUFBQSxBQUFRLEtBQVIsQUFBYSxXQUFXLFFBQUEsQUFBUSxRQUFSLEFBQWdCLFFBQWhCLEFBQXdCLEtBQWpFLEFBQXlDLEFBQTZCLEFBQ3RFO2NBQU0sU0FBUywyQkFBZixBQUFlLEFBQWUs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LFVBQUwsRUFBRixFQUFxQixLQUFyQixDQUEyQixNQUEzQjtBQUNIOzs7bUNBdkN3QjtBQUFBLDhDQUFOLElBQU07QUFBTixvQkFBTTtBQUFBOztBQUNyQixtQkFBTyxtQ0FBSSxJQUFKLGdCQUFZLElBQVosTUFBa0IsR0FBbEIsRUFBUDtBQUNIOzs7Ozs7UUF3Q0csZ0IsR0FBQSxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xEUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SSxBQUVNO2tDQUNGOztnQ0FBQSxBQUFZLFNBQWdIO1lBQXZHLEFBQXVHLDhEQUFqRyxBQUFpRywyQkFBQTtZQUFqRixBQUFpRiw2REFBNUUsQUFBNEUseURBQUE7WUFBOUIsQUFBOEIsOERBQXhCLEFBQXdCLG9CQUFBO1lBQWYsQUFBZSwrREFBUixBQUFRLG1CQUFBOzs4QkFBQTs7MEdBQUEsQUFDbEgsU0FEa0gsQUFDekcsT0FEeUcsQUFDbEcsTUFEa0csQUFDNUYsQUFDNUI7O2NBQUEsQUFBSyxPQUFPLFFBQUEsQUFBUSxLQUFwQixBQUFZLEFBQWEsQUFDekI7Y0FBQSxBQUFLLFNBSG1ILEFBR3hILEFBQWM7ZUFDakI7Ozs7O3dDQUVlLEFBQ1o7d0pBQ3FGLEtBRHJGLEFBQzBGLCtEQUMxRCxLQUZoQyxBQUVxQyw2QkFBc0IsS0FGM0QsQUFFZ0UsU0FFbkU7Ozs7Ozs7USxBQUdHLHFCLEFBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtCYXNlQWN0aW9ufSBmcm9tICcuL2FjdGlvbnMvQmFzZUFjdGlvbic7XG5pbXBvcnQge01vZGFsRGlhbG9nfSBmcm9tICcuL2FjdGlvbnMvTW9kYWxEaWFsb2cnO1xuaW1wb3J0IHtEZWxldGVDb25maXJtYXRpb259IGZyb20gJy4vY29uZmlybWF0aW9ucy9EZWxldGVDb25maXJtYXRpb24nO1xuXG5cbmNsYXNzIFlpaTJBZG1pbkFwcGxpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZihwb2x5Z2xvdCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBhbmQgY29uZmlndXJlIGRldmdyb3VwL3lpaTItcG9seWdsb3QuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihnbG9iYWwubW9uc3RlcikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBZaWkyQWRtaW5BcHBsaWNhdGlvbi53YXJuKCdZb3UgTVVTVCBzZXR1cCBmcm9udGVuZC1tb25zdGVyLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbnN0ZXIgPSBnbG9iYWwubW9uc3RlcjtcbiAgICB9XG4gICAgdGhpcy5iaW5kSGVscGVycygpO1xuICB9XG5cbiAgYmluZEhlbHBlcnMoKSB7XG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1hZG1pbi1hY3Rpb25dJywgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9ICQodGhpcyk7XG4gICAgICBjb25zdCBhY3Rpb25UeXBlID0gZWxlbWVudC5kYXRhKCdhZG1pbkFjdGlvbicpO1xuICAgICAgaWYgKGFjdGlvblR5cGUgPT09ICdNb2RhbERpYWxvZycpIHtcbiAgICAgICAgTW9kYWxEaWFsb2cuaW5zdGFuY2UoZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVsZW1lbnQuYXR0cignaHJlZicpIHx8IGVsZW1lbnQuY2xvc2VzdCgnZm9ybScpLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgQmFzZUFjdGlvbihlbmRwb2ludCk7XG4gICAgICAgIGFjdGlvbi5ydW4oW10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbZGF0YS1hY3Rpb25dJywgZnVuY3Rpb24oKXtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICBzd2l0Y2ggKCR0aGlzLmRhdGEoJ2FjdGlvbicpKSB7XG4gICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgbGV0IHt0aXRsZT1cIkRlbGV0ZSBpdGVtP1wiLCB0ZXh0PVwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGl0ZW0/XCIsIGNsb3NlPVwiQ2xvc2VcIiwgbWV0aG9kPVwicG9zdFwifSA9XG4gICAgICAgICAgICAgICR0aGlzLmRhdGEoKTtcbiAgICAgICAgICBEZWxldGVDb25maXJtYXRpb24uaW5zdGFuY2UoJHRoaXMsIHRpdGxlLCB0ZXh0LCBjbG9zZSwgbWV0aG9kKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVsZXRlLWNvbmZpcm1hdGlvbi15ZXMnOlxuICAgICAgICAgIGlmICgkdGhpcy5kYXRhKCdtZXRob2QnKS50b0xvd2VyQ2FzZSgpID09PSAncG9zdCcpIHtcbiAgICAgICAgICAgICQucG9zdCgkdGhpcy5kYXRhKCdocmVmJykpLmRvbmUoZnVuY3Rpb24oKSB7d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTt9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkdGhpcy5kYXRhKCdocmVmJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgd2Fybih3YXJuaW5nTWVzc2FnZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICBpZiAodHlwZW9mKGNvbnNvbGUpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihhbGVydCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFsZXJ0KHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH1cblxuICBtb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpIHtcbiAgICByZXR1cm4gdGhpcy5tb25zdGVyLnNob3dNb2RhbE5vdGlmaWVyKG1lc3NhZ2UsIGNyaXRpY2FsTGV2ZWwpO1xuICB9XG59XG5cbmV4cG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259O1xuIiwiY2xhc3MgQmFzZUFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMubWV0aG9kID0gJ1BPU1QnO1xuICAgIHRoaXMubW9uc3RlckVycm9yTm90aWZpZXJGdW5jdGlvbiA9ICdtb2RhbE5vdGlmaWVyJztcbiAgfVxuXG4gIHN0YXRpYyBpbnN0YW5jZSguLi5yZXN0KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xuICB9XG5cbiAgcnVuKHBhcmFtcywgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuYWpheENhbGwoXG4gICAgICBwYXJhbXMsXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgLy8gc2hvdyBhbGwgbm90aWZpY2F0aW9ucyBmcm9tIGJhY2tlbmRcbiAgICAgICAgaWYgKGRhdGEubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBub3RpZmljYXRpb24gb2YgZGF0YS5ub3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgICBnbG9iYWwubW9uc3Rlci5zaG93Qm9vdHN0cmFwQm94Tm90aWZpZXIobm90aWZpY2F0aW9uLm1lc3NhZ2UsIG5vdGlmaWNhdGlvbi5jcml0aWNhbExldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2FsbCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrXG4gICAgICAgIGlmIChkYXRhLmVycm9yID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChzdWNjZXNzQ2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjayhkYXRhLmNvbnRlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZXJyb3JDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgc2hvd0Vycm9yTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5tb25zdGVyW3RoaXMubW9uc3RlckVycm9yTm90aWZpZXJGdW5jdGlvbl0obWVzc2FnZSwgJ2Vycm9yJyk7XG4gIH1cblxuICBhamF4Q2FsbChwYXJhbXMsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgIHJldHVybiAkLmFqYXgoXG4gICAgICB7XG4gICAgICAgIHVybDogdGhpcy5lbmRwb2ludCxcbiAgICAgICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UoZXJyb3JUaHJvd24pO1xuICAgICAgICAgIGVycm9yQ2FsbGJhY2soW10sIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IHtCYXNlQWN0aW9ufTtcbiIsImltcG9ydCB7QmFzZUFjdGlvbn0gZnJvbSAnLi9CYXNlQWN0aW9uJztcbmltcG9ydCB7WWlpMkFkbWluQXBwbGljYXRpb259IGZyb20gJy4uL1lpaTJBZG1pbkFwcGxpY2F0aW9uJztcblxuY2xhc3MgTW9kYWxEaWFsb2cgZXh0ZW5kcyBCYXNlQWN0aW9uIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIGxldCBlbmRwb2ludCA9ICcnO1xuICAgIGxldCBwYXJhbXNDYWxsYmFjayA9IG51bGw7XG4gICAgY29uc29sZS5sb2coZWxlbWVudFswXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICBzd2l0Y2ggKGVsZW1lbnRbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2J1dHRvbic6XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgY29uc3QgZm9ybSA9IGVsZW1lbnQuY2xvc2VzdCgnZm9ybScpO1xuICAgICAgcGFyYW1zQ2FsbGJhY2sgPSBmdW5jdGlvbiBwYXJhbXMoKSB7XG4gICAgICAgIHJldHVybiBmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgICB9O1xuICAgICAgZW5kcG9pbnQgPSBmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYSc6XG4gICAgICBwYXJhbXNDYWxsYmFjayA9IGZ1bmN0aW9uIHBhcmFtcygpIHtyZXR1cm4gW107fTtcbiAgICAgIGVuZHBvaW50ID0gZWxlbWVudC5hdHRyKCdocmVmJyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignTW9kYWxEaWFsb2cgYWN0aW9uIGV4cGVjdHMgZWxlbWVudCBvZiB0eXBlIGJ1dHRvbiwgaW5wdXQgb3IgYSBmb3IgZW5kcG9pbnQgZGV0ZWN0aW9uJyk7XG4gICAgICBwYXJhbXNDYWxsYmFjayA9IGZ1bmN0aW9uIHBhcmFtcygpIHtcbiAgICAgICAgWWlpMkFkbWluQXBwbGljYXRpb24ud2FybignZGVmYXVsdCBwYXJhbXNDYWxsYmFjayBjYWxsZWQnKTtcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc3VwZXIoZW5kcG9pbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIHN1cGVyLnJ1bihcbiAgICAgIHBhcmFtc0NhbGxiYWNrKCksXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKGNvbnRlbnQpIHtcbiAgICAgICAgZ2xvYmFsLm1vbnN0ZXIuc2hvd0Jvb3RzdHJhcE1vZGFsTm90aWZpZXIoY29udGVudCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7TW9kYWxEaWFsb2d9O1xuIiwiaW1wb3J0IHtZaWkyQWRtaW5BcHBsaWNhdGlvbn0gZnJvbSAnLi9ZaWkyQWRtaW5BcHBsaWNhdGlvbi5qcyc7XG5cbmdsb2JhbC5BZG1pbkFwcCA9IG5ldyBZaWkyQWRtaW5BcHBsaWNhdGlvbigpO1xuXG4iLCJjbGFzcyBCYXNlQ29uZmlybWF0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRpdGxlID0gXCJUaXRsZVwiLCB0ZXh0ID0gXCJUZXh0XCIsIGNsb3NlID0gXCJjbG9zZVwiKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5jbG9zZSA9IGNsb3NlO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnN0YW5jZSguLi5yZXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyguLi5yZXN0KS5ydW4oKTtcbiAgICB9XG5cbiAgICByZW5kZXJGb3JtKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLnJlbmRlckhlYWQoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5yZW5kZXJCb2R5KCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMucmVuZGVyQnV0dG9ucygpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgcmVuZGVySGVhZCgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiJHt0aGlzLmNsb3NlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiA+JHt0aGlzLnRpdGxlfTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICByZW5kZXJCb2R5KCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMudGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIHJlbmRlckJ1dHRvbnMoKSB7XG4gICAgICAgIHJldHVybiBgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4ke3RoaXMuY2xvc2V9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICAgICQodGhpcy5yZW5kZXJGb3JtKCkpLm1vZGFsKCdzaG93Jyk7XG4gICAgfVxufVxuXG5leHBvcnQge0Jhc2VDb25maXJtYXRpb259O1xuIiwiaW1wb3J0IHtCYXNlQ29uZmlybWF0aW9ufSBmcm9tICcuL0Jhc2VDb25maXJtYXRpb24nO1xuXG5jbGFzcyBEZWxldGVDb25maXJtYXRpb24gZXh0ZW5kcyBCYXNlQ29uZmlybWF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCB0aXRsZT1cIkRlbGV0ZSBpdGVtP1wiLCB0ZXh0PVwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGl0ZW0/XCIsIGNsb3NlPVwiQ2xvc2VcIiwgbWV0aG9kPVwicG9zdFwiKSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIHRpdGxlLCB0ZXh0LCBjbG9zZSk7XG4gICAgICAgIHRoaXMuaHJlZiA9IGVsZW1lbnQuYXR0cignaHJlZicpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICB9XG5cbiAgICByZW5kZXJCdXR0b25zKCkge1xuICAgICAgICByZXR1cm4gYCA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JHt0aGlzLmNsb3NlfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgZGF0YS1ocmVmPVwiJHt0aGlzLmhyZWZ9XCIgZGF0YS1tZXRob2Q9XCIke3RoaXMubWV0aG9kfVwiIGRhdGEtYWN0aW9uPVwiZGVsZXRlLWNvbmZpcm1hdGlvbi15ZXNcIiBjbGFzcz1cImJ0biBidG4td2FybmluZ1wiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lXCI+0J7QujwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIH1cbn1cblxuZXhwb3J0IHtEZWxldGVDb25maXJtYXRpb259O1xuIl19
