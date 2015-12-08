<?php

namespace DevGroup\AdminUtils\structures;

use yii\base\Object;

class AjaxResponse extends Object
{
    /** @var string HTML content */
    public $content = '';

    /** @var bool Flag if there's some critical error */
    public $error = false;

    /** @var Notification[] Notifications that should be sent with this response */
    public $notifications = [];

    /** @var int Server timestamp */
    public $responseTime = 0;

    public function __construct($content, $error = false, $notifications = [], $config = [])
    {
        parent::__construct($config);
        $this->content = $content;
        $this->error = $error;
        $this->notifications = $notifications;
        $this->responseTime = time();
    }
}