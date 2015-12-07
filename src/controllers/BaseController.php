<?php

namespace DevGroup\AdminUtils\controllers;

use DevGroup\Frontend\assets\FrontendMonster;
use Yii;
use yii\web\Controller;

/**
 * Class BaseController is the base controller class that should be used in your yii2 app
 *
 * @package DevGroup\AdminUtils\controllers
 */
class BaseController extends Controller
{
    /**
     * Overrides default init adding some additional stuff
     */
    public function init ()
    {
        parent::init();
        // switch layout to admin or developer-defined in params
        $this->layout = isset(Yii::$app->params['admin.layout']) ? Yii::$app->params['admin.layout'] : '@app/views/layouts/admin';

        // register frontend monster
        FrontendMonster::register($this->view);

    }
}
