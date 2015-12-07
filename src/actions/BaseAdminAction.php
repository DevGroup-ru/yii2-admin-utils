<?php

namespace DevGroup\AdminUtils\actions;

use yii\base\Action;

class BaseAdminAction extends Action
{
    public $viewFile = 'undefined-view-file';

    /**
     * Renders a view
     *
     * @param array  $params params for render-view
     *
     * @return string result of the rendering
     */
    protected function render($params)
    {
        return $this->controller->render($this->viewFile, $params);
    }
}