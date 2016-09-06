<?php

namespace DevGroup\AdminUtils\controllers;

use DevGroup\AdminUtils\traits\AdminResponse;
use DevGroup\AdminUtils\assets\AdminBundle;
use DevGroup\Frontend\assets\FrontendMonster;
use DevGroup\Frontend\controllers\FrontendController;
use DevGroup\Frontend\traits\ContentNegotiator;
use Yii;

/**
 * Class BaseController is the base controller class that should be used in your yii2 app
 *
 * @package DevGroup\AdminUtils\controllers
 */
class BaseController extends FrontendController
{
    use AdminResponse;
    use ContentNegotiator;

    /**
     * Overrides default init adding some additional stuff
     */
    public function init()
    {
        parent::init();
        $this->on(FrontendController::EVENT_BEFORE_ACTION, function() {
            // switch layout to admin or developer-defined in params
            $this->layout = isset(Yii::$app->params['admin.layout'])
                ? Yii::$app->params['admin.layout']
                : '@app/views/layouts/main';

            // register frontend monster
            AdminBundle::register($this->view);

            return true;
        });
    }

}
