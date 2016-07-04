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
        $this->registerTranslations();
    }

    /**
     * Add custom translations source
     */
    public function registerTranslations()
    {
        Yii::$app->i18n->translations['@adminUtils/*'] = [
            'class' => 'yii\i18n\PhpMessageSource',
            'sourceLanguage' => 'en-US',
            'basePath' => '@adminUtils/translations',
            'fileMap' => [
                '@adminUtils/app' => 'app.php',
            ],

        ];
    }


    /**
     * Add custom translations method
     */
    public static function t($category, $message, $params = [], $language = null)
    {
        return Yii::t('@adminUtils/' . $category, $message, $params, $language);
    }
}
