import { Vue } from 'vue-property-decorator';

export class General {
    /** En translation: _30days */
    get _30days(): string {
        return Vue.i18n.translate('30 days en 55', Vue.i18n.locale());
    }
    /** En translation: _7days */
    get _7days(): string {
        return Vue.i18n.translate('7 days en', Vue.i18n.locale());
    }
}