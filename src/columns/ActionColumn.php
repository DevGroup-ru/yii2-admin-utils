<?php

namespace DevGroup\AdminUtils\columns;

use DevGroup\AdminUtils\Helper;
use kartik\icons\Icon;
use Yii;
use yii\grid\Column;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;

/**
 * Class ActionColumn is an advanced ActionColumn for modern bootstrap admin grids
 *
 * @package DevGroup\AdminUtils\columns
 */
class ActionColumn extends Column
{
    public $buttons;

    private $defaultButtons = [];

    public $appendReturnUrl = true;

    public $buttonSizeClass = 'btn-sm';

    /**
     * @var array Params to append to every button's URL if button doesn't redefine it.
     */
    public $appendUrlParams = [];

    public function init()
    {
        parent::init();

        $this->defaultButtons = [
            'edit' => [
                'url' => 'edit',
                'icon' => 'pencil',
                'class' => 'btn-primary',
                'label' => Yii::t('app', 'Edit'),
            ],
            'delete' => [
                'url' => 'delete',
                'icon' => 'trash-o',
                'class' => 'btn-danger',
                'label' => Yii::t('app', 'Delete'),
                'options' => [
                    'data-action' => 'delete',
                ],
            ]
        ];


        if (null === $this->buttons) {
            $this->buttons = $this->defaultButtons;
        }
    }

    /**
     * Creates a URL for the given action and model.
     * This method is called for each button and each row.
     *
     * @param string               $action          the button name (or action ID)
     * @param \yii\db\ActiveRecord $model           the data model
     * @param mixed                $key             the key associated with the data model
     * @param integer              $index           the current row index
     * @param bool                 $appendReturnUrl custom return url for each button
     * @param array                $urlAppend       custom append url for each button
     * @param string               $keyParam        custom param if $key is string
     * @param array                $attrs           list of model attributes used in route params
     *
     * @return string the created URL
     */
    public function createUrl(
        $action,
        \yii\db\ActiveRecord $model,
        $key,
        $appendReturnUrl,
        $urlAppend,
        $keyParam = 'id',
        $attrs = []
    ) {

        $params = [];
        if (is_array($key)) {
            $params = $key;
        } else {
            if (is_null($keyParam) === false) {
                $params = [$keyParam => (string) $key];
            }
        }
        $params[0] = $action;
        foreach ($attrs as $attrName) {
            if ($attrName === 'model') {
                $params['model'] = $model;
            } else {
                $params[$attrName] = $model->getAttribute($attrName);
            }
        }
        $params = ArrayHelper::merge($params, $urlAppend);

        if ($appendReturnUrl) {
            $params['returnUrl'] = Helper::returnUrl();
        }
        return Url::toRoute($params) . $urlAppend;

    }

    /**
     * Renders cell content(buttons)
     *
     * @param mixed $model
     * @param mixed $key
     * @param int   $index
     *
     * @return string
     */
    protected function renderDataCellContent($model, $key, $index)
    {
        $data = Html::beginTag('div', ['class' => 'btn-group']);
        foreach ($this->buttons as $button) {
            $appendReturnUrl = ArrayHelper::getValue($button, 'appendReturnUrl', $this->appendReturnUrl);
            $urlAppend = ArrayHelper::getValue($button, 'urlAppend', $this->url_append);
            $keyParam = ArrayHelper::getValue($button, 'keyParam', 'id');
            $attrs = ArrayHelper::getValue($button, 'attrs', []);

            Html::addCssClass($button, 'btn');
            Html::addCssClass($button, $this->buttonSizeClass);

            $buttonText = isset($button['text']) ? ' ' . $button['text'] : '';
            $icon = empty($button['icon']) ? '' : Icon::show($button['icon']) . '&nbsp;';

            $data .= Html::a(
                $icon . $buttonText,
                $url = $this->createUrl(
                    $button['url'],
                    $model,
                    $key,
                    $appendReturnUrl,
                    $urlAppend,
                    $keyParam,
                    $attrs
                ),
                ArrayHelper::merge(
                    isset($button['options']) ? $button['options'] : [],
                    [
                        'class' => $button['class'],
                        'title' => $button['label'],
                    ]
                )
            ) . ' ';
        }
        $data .= '</div>';
        return $data;
    }
}
