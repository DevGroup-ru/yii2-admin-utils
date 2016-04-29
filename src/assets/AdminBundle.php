<?php

namespace DevGroup\AdminUtils\assets;

use yii\web\AssetBundle;

class AdminBundle extends AssetBundle
{
    public $js = [
        'scripts/app.js',
    ];

    public $css = [
        'styles/admin-lte-addons.min.css',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . DIRECTORY_SEPARATOR . 'dist/';
    }

    public $depends = [
        'yii\bootstrap\BootstrapAsset',
        'yii\bootstrap\BootstrapPluginAsset',
    ];
}
