<?php
use yii\bootstrap\Nav;

/** @var string $actionBem */
/** @var string $key */
/** @var array  $part */

?>
<div class="box box-solid configuration-navigation">
    <div class="box-header with-border">
        <h3 class="box-title">
            <i class="<?= $part['icon'] ?>"></i>
            <?= $part['title'] ?>
        </h3>
    </div>
    <div class="box-body no-padding">
        <?=
        Nav::widget([
            'items' => $part['result'],
            'options' => [
                'class' => 'nav-pills nav-stacked',
            ],
        ])
        ?>
    </div>
</div>