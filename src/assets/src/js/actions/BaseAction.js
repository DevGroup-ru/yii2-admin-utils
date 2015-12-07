import {Yii2AdminApplication} from '../Yii2AdminApplication';

class BaseAction {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.method = 'POST';
  }

  run(params) {
    return this.ajaxCall(
      params,
      function success() {
        // do something usefull with data

      }
    );
  }

  static showErrorMessage(message) {
    return Yii2AdminApplication.modalNotifier(message, 'error');
  }

  ajaxCall(params, callback) {
    return $.ajax(
      {
        url: this.endpoint,
        method: this.method,
        data: params,
        success: function success(data) {
          callback(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          BaseAction.showErrorMessage(errorThrown);
        },
      }
    );
  }
}
export {BaseAction};
