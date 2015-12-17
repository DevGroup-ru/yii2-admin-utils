<?php
/** @var string $actionBem */
/** @var string $key */
/** @var array  $part */
$label = '';

if (isset($part['icon'])) {
    $label = "<i class=\"{$part['icon']}\"></i>&nbsp;";
}
if (isset($part['title'])) {
    $label .= $part['title'];
}

echo DevGroup\Multilingual\widgets\MultilingualFormTabs::widget([
    'model' => $model,
    'childView' => $part['childView'],
    'form' => $form,
    'tagClass' => "{$actionBem}__{$key}",
    'footer' => '<div class="nav-tabs-custom__footer">' . $part['footer'] . '</div>',
    'additionalTabs' => [
        [
            'label' => $label,
            'url' => false,
            'headerOptions' => [
                'class' => 'pull-left header',
            ],
        ],
    ],
    'options' => [
        'class' => 'pull-right',
    ],
]);
?>
