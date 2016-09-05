<?php

namespace DevGroup\AdminUtils;

use yii;
use yii\base\Application;
use yii\base\BootstrapInterface;

class UniqueIds implements BootstrapInterface
{

    /**
     * Bootstrap method to be called during application bootstrap stage.
     *
     * @param Application $app the application currently running
     */
    public function bootstrap($app)
    {
        if ($app instanceof yii\web\Application) {
            Yii::$container->set('yii\widgets\ActiveForm', function ($di, $params, $config) {
                if (!isset($config['id'])) {
                    $config['id'] = str_replace('.', '_', uniqid('ActiveForm_', true));
                }

                return new yii\widgets\ActiveForm($config);
            });
        }
    }
}
