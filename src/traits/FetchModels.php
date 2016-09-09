<?php

namespace DevGroup\AdminUtils\traits;


use yii\db\ActiveRecord;

trait FetchModels
{
    /**
     * Workaround to have ability use Model::load() method instead assigning values from request by hand
     *
     * @param array $params
     * @param string $fromClass class name
     * @param ActiveRecord $toModel
     * @return array
     */
    public static function fetchParams($params, $fromClass, $toModel)
    {
        if (true === empty($params)
            || false === class_exists($fromClass)
            || false === $toModel instanceof ActiveRecord
        ) {
            return [];
        }
        $outParams = [];
        $toClass = get_class($toModel);
        $fromName = array_pop(explode('\\', $fromClass));
        $toName = array_pop(explode('\\', $toClass));
        if (true === isset($params[$fromName])) {
            foreach ($params[$fromName] as $key => $value) {
                if (true === in_array($key, $toModel->attributes(), true)) {
                    $outParams[$toName][$key] = $value;
                }
            }
        }
        return $outParams;
    }
}
