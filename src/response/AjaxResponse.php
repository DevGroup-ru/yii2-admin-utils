<?php

namespace DevGroup\AdminUtils\response;

use yii\base\Object;

class AjaxResponse extends Object
{
    /** @var string HTML content */
    public $content = '';

    /** @var bool Flag if there's some critical error */
    public $error = false;

    /** @var array Notifications that should be sent with this response */
    public $notifications = [];

    /** @var int Server timestamp */
    public $responseTime = 0;

    /** @var bool Flag showing if action is ended and user can be redirected back */
    public $actionEnded = false;

    public function __construct($content, $error = false, $notifications = [], $config = [])
    {
        parent::__construct($config);
        $this->content = $content;
        $this->error = $error;
        $this->notifications = $notifications;
        $this->responseTime = time();
    }
}