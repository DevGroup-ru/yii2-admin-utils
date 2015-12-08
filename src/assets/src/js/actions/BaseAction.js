import {Yii2AdminApplication} from '../Yii2AdminApplication';

class BaseAction {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.method = 'POST';
  }

  run(params) {
    return this.ajaxCall(
      params,
      function success(data) {
        // do something usefull with data
        console.log('do something usefull with data');
        console.log(data);


        if (data.notifications.length > 0) {
          for (const notification of data.notifications) {
            console.log(notification);
            global.monster.showBootstrapBoxNotifier(notification.message, notification.criticalLevel);
          }
        }
      }
    );
  }

  static showErrorMessage(message) {
    return global.monster.modalNotifier(message, 'error');
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
