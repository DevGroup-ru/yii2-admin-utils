<?php
/** @var array $actionsOutput */
/** @var string $formStartCode */
/** @var \yii\bootstrap\ActiveForm $form */
/** @var array $_params_ */
echo $formStartCode;

echo $this->render('combined-action', $_params_);

$form->end();
?>

