<?php

namespace DevGroup\AdminUtils\actions;

use DevGroup\AdminUtils\AdminModule;
use Yii;
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use yii\web\View;

abstract class FormCombinedAction extends CombinedAction
{
    /** @var \yii\db\ActiveRecord */
    public $model = null;

    public $formOptions = [
        'layout' => 'horizontal',
    ];
    /**
     * @var ActiveForm
     */
    protected $form = null;
    protected $formStartCode = '';

    const TYPE_MULTILINGUAL_TABS = 'multilingual-tabs';

    public function beforeActionRun()
    {
        ob_start();
        ob_implicit_flush(false);
        $this->form = ActiveForm::begin($this->formOptions);
        $this->formStartCode = ob_get_contents();

        ob_end_clean();

        parent::beforeActionRun();
    }

    public function renderActionsOutput($actionsOutput)
    {
        /** @var \DevGroup\AdminUtils\controllers\BaseController $controller */
        $controller = $this->controller;

        if (isset($this->model)) {
            $universalFooter = $this->getFooter();
            foreach ($actionsOutput as &$part) {
                $part['footer'] = $universalFooter;
            }
        }

        return $controller->renderResponse(
            '@adminUtils/actions/views/form-combined-action.php',
            [
                'actionsOutput' => $actionsOutput,
                'formStartCode' => $this->formStartCode,
                'form' => $this->form,
                'combinedAction' => $this,
            ]
        );
    }

    public function getFooter()
    {
        return Html::submitButton(
            '<i class="fa fa-floppy-o"></i>&nbsp;' .
            (
            $this->model->isNewRecord ? AdminModule::t('app', 'Create') : AdminModule::t('app', 'Save')
            ),
            [
                'class' => $this->model->isNewRecord
                    ? 'btn btn-success'
                    : 'btn btn-primary'
            ]
        );
    }

    public function renderPart($key, $part, View $view)
    {
        $actionBem = strtr(Yii::$app->requestedAction->id, ['/' => '__']);

        if (!isset($part['type'])) {
            $part['type'] = 'box';
        }
        switch ($part['type']) {
            case self::TYPE_MULTILINGUAL_TABS:
                return $view->render(
                    '_multilingual-tabs',
                    [
                        'part' => $part,
                        'key' => $key,
                        'actionBem' => $actionBem,
                        'form' => $this->form,
                        'model' => $this->model,
                    ]
                );
            default:
                return parent::renderPart($key, $part, $view);
        }
    }
}
