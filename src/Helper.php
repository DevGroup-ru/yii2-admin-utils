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
     * returnURL param value.
     * Used for links from grids and etc. where we should return back to specified URL
     *
     * @return string
     */
    public static function returnUrl()
    {
        if (self::$returnUrl === null) {
            $url = ['/' . ltrim(Yii::$app->requestedRoute, '/')];
            foreach (Yii::$app->request->queryParams as $key => $value) {
                $url[$key] = $value;
            }
            self::$returnUrl = Url::to($url);

        }
        return self::$returnUrl;
    }
}
