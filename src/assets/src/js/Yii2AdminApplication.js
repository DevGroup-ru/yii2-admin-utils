import {ModalNotifier} from './notifiers/ModalNotifier.js';

class Yii2AdminApplication {
  constructor() {
    if (typeof(polyglot) === 'undefined') {
      const warningMessage = 'You MUST setup and configure devgroup/yii2-polyglot.';
      /*eslint-disable */
      if (typeof(console) !== 'undefined') {
        console.warn(warningMessage);
      } else if (typeof(alert) === 'function') {
        alert(warningMessage);
      }
      /*eslint-enable */
    }
  }

  static modalNotifier(message, criticalLevel) {
    return new ModalNotifier(message, criticalLevel);
  }
}

export {Yii2AdminApplication};
