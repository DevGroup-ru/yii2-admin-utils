import {BaseAction} from './actions/BaseAction';
import {ModalDialog} from './actions/ModalDialog';
import {DeleteConfirmation} from './confirmations/DeleteConfirmation';


class Yii2AdminApplication {
  constructor() {
    if (typeof(polyglot) === 'undefined') {
      Yii2AdminApplication.warn('You MUST setup and configure devgroup/yii2-polyglot.');
    }

    if (typeof(global.monster) === 'undefined') {
      Yii2AdminApplication.warn('You MUST setup frontend-monster.');
    } else {
      this.monster = global.monster;
    }
    this.bindHelpers();
  }

  bindHelpers() {
    $('body').on('click', '[data-admin-action]', function clickHandler() {
      const element = $(this);
      const actionType = element.data('adminAction');
      if (actionType === 'ModalDialog') {
        ModalDialog.instance(element);
      } else {
        const endpoint = element.attr('href') || element.closest('form').attr('action');
        const action = new BaseAction(endpoint);
        action.run([]);
      }
      return false;
    });

    $('body').on('click', '[data-action]', function(){
      var $this = $(this);
      switch ($this.data('action')) {
        case 'delete':
          let {title="Delete item?", text="Are you sure you want to delete this item?", close="Close", method="post"} =
              $this.data();
          DeleteConfirmation.instance($this, title, text, close, method);
          break;
        case 'delete-confirmation-yes':
          if ($this.data('method').toLowerCase() === 'post') {
            $.post($this.data('href'))
              .done(function() {
                window.location.reload(true);
              })
              .error(function(error) {
                alert(error.status + ': ' + error.statusText);
                window.location.reload(true);
              });
          } else {
            window.location.href = $this.data('href');
          }
          break
      }
      return false;
    });
  }

  static warn(warningMessage) {
    /*eslint-disable */
    if (typeof(console) !== 'undefined') {
      console.warn(warningMessage);
    } else if (typeof(alert) === 'function') {
      alert(warningMessage);
    }
    /*eslint-enable */
  }

  modalNotifier(message, criticalLevel) {
    return this.monster.showModalNotifier(message, criticalLevel);
  }
}

export {Yii2AdminApplication};
