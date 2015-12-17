<?php

namespace DevGroup\AdminUtils;

use Yii;
use yii\base\Application;
use yii\base\BootstrapInterface;
use yii\base\Module;

class AdminModule extends Module implements BootstrapInterface
{

    /**
     * Bootstrap method to be called during application bootstrap stage.
     *
     * @param Application $app the application currently running
     */
    public function bootstrap($app)
    {
        Yii::setAlias('@adminUtils', __DIR__);
    }
}
