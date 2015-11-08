<?php

namespace DevGroup\AdminUtils;

use kartik\icons\Icon;
use Yii;
use yii\db\ActiveRecord;
use yii\helpers\Html;

/**
 * Various helper functions for frontend
 *
 * @package DevGroup\AdminUtils
 */
class FrontendHelper
{
    /**
     * Shows action buttons for form:
     * - **Back** - return user to previous page based on `returnUrl` GET param
     * - **Save & Go next** - only on new records, save current record and create new
     * - **Save & Go back** - save current record and go back to previous page based on `returnUrl` GET param
     * - **Save** - save current record and stay on current record editing page.
     *
     * @param ActiveRecord $model Model instance
     * @param string $indexAction Route path to index action
     * @param string $buttonSizeClass Bootstrap3 button size class
     * @param boolean $onlySaveAndBack Show only two buttons: Back and Save
     *
     * @return string Rendered save buttons with redirectUrl
     */
    public static function formSaveButtons(
        ActiveRecord $model,
        $indexAction = 'index',
        $buttonSizeClass = 'btn-sm',
        $onlySaveAndBack = false
    ) {
        $result = '<div class="form-group no-margin btn-group">';
        if ($onlySaveAndBack === false) {
            $result .=
                Html::a(
                    Icon::show('arrow-circle-left') . '&nbsp;' . Yii::t('app', 'Back'),
                    Yii::$app->request->get('returnUrl', [$indexAction, 'id' => $model->id]),
                    ['class' => 'btn btn-default form-action-button--back' . $buttonSizeClass]
                );
        }
        if ($model->isNewRecord && $onlySaveAndBack === false) {
            $result .= Html::submitButton(
                Icon::show('save') . '&nbsp;' . Yii::t('app', 'Save & Go next'),
                [
                    'class' => 'btn btn-success form-action-button--save-and-next' . $buttonSizeClass,
                    'name' => 'action',
                    'value' => 'save-and-next',
                ]
            );
        }
        $result .=
            Html::submitButton(
                Icon::show('save') . '&nbsp;' . Yii::t('app', 'Save & Go back'),
                [
                    'class' => 'btn btn-warning form-action-button--save-and-back' . $buttonSizeClass,
                    'name' => 'action',
                    'value' => 'save-and-back',
                ]
            );
        if ($onlySaveAndBack === false) {
            $result .=
                Html::submitButton(
                    Icon::show('save') . '&nbsp;' . Yii::t('app', 'Save'),
                    [
                        'class' => 'btn btn-primary form-action-button--save' . $buttonSizeClass,
                        'name' => 'action',
                        'value' => 'save',
                    ]
                );
        }
        $result .= '</div>';
        return $result;
    }
}
