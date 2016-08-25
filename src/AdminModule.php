<?php

namespace DevGroup\AdminUtils;

use Yii;
use yii\base\Module;

class AdminModule extends Module
{
    /**
     * Add custom translations method
     */
    public static function t($category, $message, $params = [], $language = null)
    {
        return Yii::t('@DevGroup/AdminUtils/' . $category, $message, $params, $language);
    }
}
