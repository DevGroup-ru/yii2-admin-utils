<?php

namespace DevGroup\AdminUtils\actions;

use DevGroup\AdminUtils\traits\AdminResponse;
use yii\base\Action;

class BaseAdminAction extends Action
{
    use AdminResponse;

    public $viewFile = 'undefined-view-file';

    /**
     * Renders a view
     *
     * @param array  $params params for render-view
     *
     * @return string result of the rendering
     */
    public function render($params)
    {
        return $this->controller->renderResponse($this->viewFile, $params);
    }
}