<?php

namespace DevGroup\AdminUtils\traits;

use DevGroup\AdminUtils\structures\AjaxResponse;
use DevGroup\AdminUtils\structures\Notification;
use Yii;
use yii\web\Response;


/**
 * Class AdminResponse
 *
 * @package DevGroup\AdminUtils\traits
 * @method string renderAjax($view, array $params)
 * @method string render($view, array $params)
 */
trait AdminResponse {
    /** @var \DevGroup\AdminUtils\structures\Notification[] Notifications that should be sent with this response */
    public $notifications = [];

    /**
     * Generates response for current request based on it's type
     *
     * @param string $view
     * @param array  $params
     *
     * @return \DevGroup\AdminUtils\structures\AjaxResponse|string
     */
    public function renderResponse($view, $params = [])
    {
        /** @var \DevGroup\AdminUtils\controllers\BaseController $context */
        $context = $this instanceof \yii\base\Action ? $this->controller : $this;
        if (Yii::$app->request->isAjax === true) {
            Yii::$app->response->format = Response::FORMAT_JSON;

            $content = $context->renderAjax($view, $params);
            return new AjaxResponse($content, false, $this->notifications);
        } else {
            foreach ($this->notifications as $notification) {
                Yii::$app->session->setFlash($notification->flashKey(), $notification->message);
            }
            return $context->render($view, $params);
        }
    }

    /**
     * Notify user of something.
     * You should use this function instead of `Yii::$app->session->setFlash`
     *
     * @param     $message
     * @param int $criticalLevel
     */
    public function notify($message, $criticalLevel = Notification::LEVEL_SUCCESS)
    {
        $context = $this instanceof \yii\base\Action ? $this->controller : $this;
        $context->notifications[] = new Notification($message, $criticalLevel);
    }
}
