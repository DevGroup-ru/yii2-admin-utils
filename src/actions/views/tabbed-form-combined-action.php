<?php
/** @var array $actionsOutput */
/** @var string $formStartCode */
/** @var \yii\bootstrap\ActiveForm $form */
/** @var array $_params_ */
/** @var DevGroup\AdminUtils\actions\CombinedAction $combinedAction */
/** @var array $actionsOutput */
use \DevGroup\AdminUtils\actions\TabbedFormCombinedAction;
$bem = strtr(Yii::$app->requestedAction->uniqueId, ['/' => '__']);

?>
<div class="<?=$bem?>">
    <?= $formStartCode ?>
        <div class="row">
            <div class="col-md-3">
                <?php
                    foreach ($actionsOutput as $key => $part) {
                        if (
                            (
                                $part['type'] === TabbedFormCombinedAction::TYPE_TABS_LINKS
                                || $part['type'] === TabbedFormCombinedAction::TYPE_TABS
                            ) && !empty($part['result'])
                        ) {
                            echo $combinedAction->renderPart($key, $part, $this);
                        }
                    }
                ?>
            </div>
            <div class="col-md-9">
                <?php
                foreach ($actionsOutput as $key => $part) {
                    if (
                        (
                            $part['type'] !== TabbedFormCombinedAction::TYPE_TABS_LINKS
                            && $part['type'] !== TabbedFormCombinedAction::TYPE_TABS
                        ) && !empty($part['result'])
                    ) {
                        echo $combinedAction->renderPart($key, $part, $this);
                    }
                }
                ?>
            </div>
        </div>
    <?php
    $form->end();
    ?>
</div>

