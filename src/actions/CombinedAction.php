<?php

namespace DevGroup\AdminUtils\actions;

use DevGroup\AdminUtils\exceptions\ActionError;
use DevGroup\AdminUtils\traits\AdminResponse;
use Yii;
use yii\base\Action;
use yii\base\ActionEvent;
use yii\helpers\ArrayHelper;
use yii\web\BadRequestHttpException;
use yii\web\Response;

abstract class CombinedAction extends Action
{
    use AdminResponse;

    const EVENT_BEFORE_RUN = 'combined-before-run';
    const EVENT_AFTER_RUN = 'combined-after-run';

    const ACTION_RUN_ALL_PARTS = 'all-parts';

    const TYPE_BOX = 'box';
    const TYPE_PLAIN = 'plain';

    public $parts = null;

    public $defaultActionType = self::ACTION_RUN_ALL_PARTS;

    public function defineParts()
    {
        return [
            'default' => [
                'function' => 'runAction',
                'title' => 'Default action',
                'icon' => 'fa fa-question-circle',
            ],
        ];
    }

    public function run()
    {
        $this->beforeActionRun();

        $this->parts = $this->defineParts();
        foreach ($this->parts as &$part) {
            if (!isset($part['type'])) {
                $part['type'] = self::TYPE_BOX;
            }
        }

        $this->controller->getView()->title = $this->title();
        $this->controller->getView()->params['breadcrumbs'] = $this->breadcrumbs();

        $actionType = $this->getRequestParam('action', $this->defaultActionType);
        if ($actionType === self::ACTION_RUN_ALL_PARTS) {
            $actionsToRun = $this->parts;
        } elseif (isset($this->parts[$actionType])) {
            $actionsToRun = [$actionType => $this->parts[$actionType]];
        } else {
            throw new ActionError("No available action for run $actionType");
        }
        $actionsOutput = [];

        foreach ($actionsToRun as $name => $actionConfig) {
            if (!isset($actionConfig['function'])) {
                $actionConfig['result'] = 'dummy';
                $actionsOutput[$name] = $actionConfig;
            } else {
                $action = $actionConfig['function'];
                $callable = is_array($action) ? $action : [$this, $action];
                $result = call_user_func_array($callable, Yii::$app->requestedParams);
                if ($result instanceof Response) {
                    // some part returned exact Response - handle it immediately
                    return $result;
                }
                $actionConfig['result'] = $result;
                $actionsOutput[$name] = $actionConfig;
            }
        }

        $content = $this->renderActionsOutput($actionsOutput);

        $content = $this->afterActionRun($content);
        return $content;
    }

    public function renderActionsOutput($actionsOutput)
    {
        /** @var \DevGroup\AdminUtils\controllers\BaseController $controller */
        $controller = $this->controller;
        return $controller->renderResponse(
            '@adminUtils/actions/views/combined-action.php',
            [
                'actionsOutput' => $actionsOutput,
                'combinedAction' => $this,
            ]
        );
    }

    public function render($viewFile, $params = [])
    {
        return $this->controller->getView()->render($viewFile, $params, $this->controller);
    }


    abstract public function breadcrumbs();

    abstract public function title();

    public function beforeActionRun()
    {
        $event = new ActionEvent($this);
        $this->trigger(self::EVENT_BEFORE_RUN, $event);
        if ($event->isValid === false) {
            throw new ActionError("EVENT_BEFORE_RUN returned error.");
        }
    }

    public function afterActionRun($content)
    {
        $event = new ActionEvent($this);
        $event->result = $content;
        $this->trigger(self::EVENT_AFTER_RUN, $event);
        return $event->result;
    }

    public function getRequestParam($key, $default = null)
    {
        $value = Yii::$app->request->get($key, null);
        if ($value === null) {
            $value = Yii::$app->request->post($key, null);
        }

        return $value === null ? $default : $value;
    }

    public function getRequiredRequestParam($key)
    {
        $value = $this->getRequestParam($key);
        if ($value === null) {
            throw new BadRequestHttpException("Required param $key is missing");
        }
        return $value;
    }

    public function renderPart($key, $part, \yii\web\View $view)
    {
        $actionBem = strtr(Yii::$app->requestedAction->id, ['/' => '__']);

        if (!isset($part['type'])) {
            $part['type'] = 'box';
        }
        switch ($part['type']) {
            case self::TYPE_PLAIN:
                return $view->render('_plain', [
                    'part' => $part,
                    'key' => $key,
                    'actionBem' => $actionBem,
                ]);
            case self::TYPE_BOX:
            default:
                return $view->render('_box', [
                    'part' => $part,
                    'key' => $key,
                    'actionBem' => $actionBem,
                ]);
        }
    }
}
