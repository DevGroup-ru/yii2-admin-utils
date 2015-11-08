<?php

namespace DevGroup\AdminUtils\events;

use Yii;
use yii\base\Event;
use yii\base\Model;
use yii\widgets\ActiveForm;

/**
 * Class ModelEditForm is an event triggered inside entity edit view-file before form closing tag
 *
 * @package DevGroup\AdminUtils\events
 */
class ModelEditForm extends Event
{
    /** @var ActiveForm $form form instance */
    public $form = null;

    /** @var Model $model edited model */
    public $model = null;

    /**
     * ModelEditForm constructor.
     *
     * @param \yii\widgets\ActiveForm $form
     * @param \yii\base\model         $model
     * @param array                   $config
     */
    public function __construct(ActiveForm $form, Model &$model, $config = [])
    {
        parent::__construct($config);

        $this->form = $form;
        $this->model = $model;
    }

    /**
     * @return \yii\web\View
     */
    public function getView()
    {
        return $this->sender;
    }
}
