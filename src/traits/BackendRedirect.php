<?php

namespace DevGroup\AdminUtils\traits;

use Yii;
use yii\helpers\Url;

/**
 * Trait BackendRedirect serves special backend redirects:
 * - **save-and-next** - only on new records, save current record and create new
 * - **save-and-back** - save current record and go back to previous page based on `returnUrl` GET param
 * - **save** - save current record and stay on current record editing page.
 *
 * Actions are set by pressing needed button generated with `FrontendHelper::formSaveButtons` function.
 *
 * @package DevGroup\AdminUtils\traits
 */
trait BackendRedirect
{
    /**
     * Redirects user as was specified by his action and returnUrl variable on successful record saving.
     *
     * @param string|integer $id Id of model
     * @param bool|string $setFlash True if set standard flash, string for custom flash, false for not setting any flash
     * @param array $indexAction URL route array to index action, must include route and can include additional params
     * @param array $editAction URL route array to edit action, must include route and can include additional params
     * @param array|boolean $overrideReturnUrl false to use default returnUrl from _GET or array to create new url
     *
     * @return \yii\web\Response
     */
    public function redirectUser(
        $id,
        $setFlash = true,
        $indexAction = ['index'],
        $editAction = ['edit'],
        $overrideReturnUrl = false
    ) {
        /** @var \yii\web\Controller $this */
        if ($setFlash === true) {
            Yii::$app->session->setFlash('success', Yii::t('app', 'Object saved'));
        } elseif (is_string($setFlash)) {
            Yii::$app->session->setFlash('success', $setFlash);
        }

        if ($overrideReturnUrl === false) {
            $returnUrl = Yii::$app->request->get(
                'returnUrl',
                Yii::$app->request->getReferrer() === null ? Url::to([$indexAction]) : Yii::$app->request->getReferrer()
            );
        } else {
            $returnUrl = $overrideReturnUrl;
        }

        switch (Yii::$app->request->post('action', 'save')) {
            case 'save-and-next':
                // as you can see there's no id param here and there should be no such in $editAction
                $url = $editAction;
                $url['returnUrl'] = $returnUrl;
                return $this->redirect($url);
            case 'save-and-back':
                return $this->redirect($returnUrl);
            default:
                $url = $editAction;
                $url['returnUrl'] = $returnUrl;
                $url['id'] = $id;
                return $this->redirect(
                    Url::toRoute(
                        [
                            $editAction,
                            'id' => $id,
                            'returnUrl' => $returnUrl,
                        ]
                    )
                );
        }
    }
}
