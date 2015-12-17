<?php
/** @var string $actionBem */
/** @var string $key */
/** @var array  $part */
?>

<div class="box <?=$actionBem?>__<?=$key?>">
    <div class="box-header">
        <?php if (!empty($part['icon'])) {
            echo "<i class=\"{$part['icon']}\"></i>&nbsp;";
        } ?>
        <h3 class="box-title">
          <?= Yii::t('app', $part['title']) ?>
        </h3>
    </div>
    <div class="box-body">
        <?= $part['result'] ?>
    </div>
    <?php if (isset($part['footer'])): ?>
        <div class="box-footer">
            <?= $part['footer']; ?>
        </div>
    <?php endif; ?>
</div>