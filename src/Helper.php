<?php

namespace DevGroup\AdminUtils;

use Yii;
use yii\helpers\Url;

/**
 * Various helper functions
 *
 * @package DevGroup\AdminUtils
 */
class Helper
{
    private static $returnUrl = null;

    /**
     * @return string returnURL param value
     */
    public static function returnUrl()
    {
        if (self::$returnUrl === null) {
            $url = ['/' . ltrim(Yii::$app->requestedRoute, '/')];
            foreach (Yii::$app->requestedParams as $key => $value) {
                $url[$key] = $value;
            }

            self::$returnUrl = Url::to($url);

        }
        return self::$returnUrl;
    }
}
