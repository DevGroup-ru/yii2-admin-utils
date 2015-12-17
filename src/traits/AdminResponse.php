<?php

namespace DevGroup\AdminUtils\traits;

use DevGroup\AdminUtils\response\AjaxResponse;
use Yii;
use yii\base\Action;
use yii\web\Response;

/**
 * Class AdminResponse
 *
 * @package DevGroup\AdminUtils\traits
 * @method string renderAjax($view, array $params)
 * @method string render($view, array $params)
 */
trait AdminResponse
{
    /**
     * Generates response for current request based on it's type
     *
     * @param string $view
     * @param array  $params
     *
     * @return \DevGroup\AdminUtils\response\AjaxResponse|string
     */
    public function renderResponse($view, $params = [])
    {
        /** @var \DevGroup\AdminUtils\controllers\BaseController $context */
        $context = $this instanceof Action ? $this->controller : $this;
        if (Yii::$app->request->isAjax === true) {
            Yii::$app->response->format = Response::FORMAT_JSON;

            $content = $context->renderAjax($view, $params);
            return new AjaxResponse($content, false, Yii::$app->session->getAllFlashes(true));
        } else {
            return $context->render($view, $params);
        }
    }

    public function endAction($defaultReturnUrl = '')
    {
        /** @var \DevGroup\AdminUtils\controllers\BaseController $context */
        $context = $this instanceof Action ? $this->controller : $this;
        if (Yii::$app->request->isAjax === true) {
            Yii::$app->response->format = Response::FORMAT_JSON;
            $content = '';
            $response = new AjaxResponse($content, false, Yii::$app->session->getAllFlashes(true));
            $response->actionEnded = true;
            return $response;
        } else {
            $returnUrl = Yii::$app->request->get('returnUrl', $defaultReturnUrl);
            return $context->redirect($returnUrl);
        }
    }
}
