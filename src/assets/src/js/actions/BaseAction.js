class BaseAction {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.method = 'POST';
    this.monsterErrorNotifierFunction = 'modalNotifier';
  }

  static instance(...rest) {
    return new this(...rest);
  }

  run(params, successCallback, errorCallback) {
    return this.ajaxCall(
      params,
      function success(data) {
        // show all notifications from backend
        if (data.notifications.length > 0) {
          for (const notification of data.notifications) {
            global.monster.showBootstrapBoxNotifier(notification.message, notification.criticalLevel);
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
      }
    );
  }

  showErrorMessage(message) {
    return global.monster[this.monsterErrorNotifierFunction](message, 'error');
  }

  ajaxCall(params, successCallback, errorCallback) {
    return $.ajax(
      {
        url: this.endpoint,
        method: this.method,
        data: params,
        success: function success(data) {
          successCallback(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          this.showErrorMessage(errorThrown);
          errorCallback([], jqXHR, textStatus, errorThrown);
        },
      }
    );
  }
}
export {BaseAction};
