import {BaseAction} from './BaseAction';
import {Yii2AdminApplication} from '../Yii2AdminApplication';

class ModalDialog extends BaseAction {
  constructor(element) {
    let endpoint = '';
    let paramsCallback = null;
    console.log(element[0].nodeName.toLowerCase());
    switch (element[0].nodeName.toLowerCase()) {
    case 'button':
    case 'input':
      const form = element.closest('form');
      paramsCallback = function params() {
        return form.serializeArray();
      };
      endpoint = form.attr('action');
      break;
    case 'a':
      paramsCallback = function params() {return [];};
      endpoint = element.attr('href');
      break;
    default:
      Yii2AdminApplication.warn('ModalDialog action expects element of type button, input or a for endpoint detection');
      paramsCallback = function params() {
        Yii2AdminApplication.warn('default paramsCallback called');
      };
      break;
    }
    super(endpoint);

    this.element = element;

    super.run(
      paramsCallback(),
      function success(content) {
        global.monster.showBootstrapModalNotifier(content);
      }
    );
  }

}

export {ModalDialog};
