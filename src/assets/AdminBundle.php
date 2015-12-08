<?php

namespace DevGroup\AdminUtils\assets;

use yii\web\AssetBundle;

class AdminBundle extends AssetBundle
{
    public $js = [
        'scripts/app.js',
    ];

    public function init()
    {
        parent::init();
        $this->sourcePath = __DIR__ . DIRECTORY_SEPARATOR . 'dist/';
    }
}
