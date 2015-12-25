<?php

namespace DevGroup\AdminUtils\validators;

use Yii;
use yii\validators\Validator;

/**
 * ClassnameValidator checks if the attribute value is a valid class name that can be used by application
 *
 * Usage:
 *
 * ```
 * public function rules()
 * {
 *      return [
 *          [
 *              ['class_name_attribute'],
 *              DevGroup\AdminUtils\validators\ClassnameValidator::className(),
 *          ]
 *      ];
 * }
 *
 * ```
 *
 * @package DevGroup\AdminUtils\validator
 */
class ClassnameValidator extends Validator
{
    /**
     * @inheritdoc
     * @return null|array
     */
    public function validateValue($value)
    {
        if (class_exists($value) === false) {
            return [
                Yii::t('admin-utils', 'Unable to find specified class.'),
                []
            ];
        } else {
            return null;
        }
    }
}