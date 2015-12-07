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
