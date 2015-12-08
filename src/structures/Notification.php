<?php

namespace DevGroup\AdminUtils\structures;

use yii\base\Object;

class Notification extends Object implements \JsonSerializable
{
    const LEVEL_SUCCESS = 0;
    const LEVEL_INFO = 1;
    const LEVEL_WARNING = 2;
    const LEVEL_ERROR = 3;

    public $criticalLevel = self::LEVEL_SUCCESS;

    public $message = '';

    public function __construct($message = '', $criticalLevel = self::LEVEL_SUCCESS, $config = [])
    {
        parent::__construct($config);
        $this->message = $message;
        $this->criticalLevel = $criticalLevel;
    }

    public function flashKey()
    {
        switch ($this->criticalLevel) {
            case self::LEVEL_SUCCESS:
                return 'success';

            case self::LEVEL_WARNING:
                return 'warning';

            case self::LEVEL_ERROR:
                return 'error';

            case self::LEVEL_INFO:
            default:
                return 'info';
        }
    }

    /**
     * Specify data which should be serialized to JSON
     *
     * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     *        which is a value of any type other than a resource.
     */
    public function jsonSerialize()
    {
        return [
            'criticalLevel' => $this->flashKey(),
            'message' => $this->message,
        ];
    }
}
