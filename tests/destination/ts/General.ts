import { Vue } from 'vue';

export class General {
    /** En translation: 30 days en 7118 */
    get _30dayss(): string {
        return Vue.i18n.translate('_30dayss', Vue.i18n.locale());
    }
    /** En translation: 7 days en */
    get _7days(): string {
        return Vue.i18n.translate('_7days', Vue.i18n.locale());
    }
}