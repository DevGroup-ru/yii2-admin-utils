<?php

namespace DevGroup\AdminUtils\events;

use Yii;
use yii\base\Event;
use yii\base\Model;

/**
 * Class DefinePartsModelEditAction is a special case of ModelEditAction triggered during defineParts process.
 *
 * @package DevGroup\AdminUtils\events
 */
class DefinePartsModelEditAction extends ModelEditAction
{
    public $parts = [];
    /**
     * ModelEditForm constructor.
     *
     * @param \yii\base\model         $model
     * @param array                   $parts
     * @param array                   $config
     */
    public function __construct(Model &$model, $parts = [], $config = [])
    {
        parent::__construct($model, $config);

        $this->parts = $parts;
    }
    
}
