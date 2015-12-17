<?php

namespace DevGroup\AdminUtils\events;

use Yii;
use yii\base\Event;
use yii\base\Model;

/**
 * Class ModelEditAction is an event triggered in entity editing actions.
 * Contains model and can stop handling next logic of action setting isValid to false.
 * Direct behavior relies on action implementation.
 *
 * @package DevGroup\AdminUtils\events
 */
class ModelEditAction extends Event
{
    /** @var Model $model edited model */
    public $model = null;

    /**
     * @var bool whether to continue running the action
     */
    public $isValid = true;

    /**
     * ModelEditForm constructor.
     *
     * @param \yii\base\model         $model
     * @param array                   $config
     */
    public function __construct(Model &$model, $config = [])
    {
        parent::__construct($config);

        $this->model = $model;
    }

}
