<?php

namespace DevGroup\AdminUtils\actions;

use Yii;
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use yii\web\View;

abstract class TabbedFormCombinedAction extends FormCombinedAction
{
    const TYPE_TABS = 'tabs';
    const TYPE_TABS_LINKS = 'tabs-links';

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
            '@DevGroup/AdminUtils/actions/views/tabbed-form-combined-action.php',
            [
                'actionsOutput' => $actionsOutput,
                'formStartCode' => $this->formStartCode,
                'form' => $this->form,
                'combinedAction' => $this,
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
            case self::TYPE_TABS:
                return $view->render(
                    '_tabbed-form-tabs',
                    [
                        'part' => $part,
                        'key' => $key,
                        'actionBem' => $actionBem,
                        'form' => $this->form,
                        'model' => $this->model,
                    ]
                );
            case self::TYPE_TABS_LINKS:
                return $view->render(
                    '_tabbed-form-tabs-links',
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
