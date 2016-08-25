<?php

namespace DevGroup\AdminUtils;

/**
 * Class Bootstrap
 * @package DevGroup\AdminUtils
 */
class Bootstrap implements \yii\base\BootstrapInterface
{
    public function bootstrap($app)
    {
        $app->i18n->translations['@DevGroup/AdminUtils/*'] = [
            'class' => 'yii\i18n\PhpMessageSource',
            'sourceLanguage' => 'en-US',
            'basePath' => '@DevGroup/AdminUtils/translations',
            'fileMap' => [
                '@DevGroup/AdminUtils/app' => 'app.php',
            ],
        ];
    }
}
