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
      if($(this).data('action') === 'delete'){
        let {title="Delete item?", text="Are you sure you want to delete this item?", close="close"} = $(this).data();
        DeleteConfirmation.instance($(this), title, text, close);
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
