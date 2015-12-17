<?php
/** @var DevGroup\AdminUtils\actions\CombinedAction $combinedAction */
/** @var array $actionsOutput */

$bem = strtr(Yii::$app->requestedAction->uniqueId, ['/' => '__']);
echo "<div class=\"{$bem}\">";

foreach ($actionsOutput as $key => $part) {
    if (!empty($part['result'])) {
        echo $combinedAction->renderPart($key, $part, $this);
    }
}

echo "</div>";