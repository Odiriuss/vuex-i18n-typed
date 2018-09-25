import { Vue } from 'vue-property-decorator';

export class General {
	/** En translation: 30 days en 36 */
	get _30days(): string {
		return Vue.i18n.translate('_30days', Vue.i18n.locale());
	}
	/** En translation: 7 days en */
	get _7days(): string {
		return Vue.i18n.translate('_7days', Vue.i18n.locale());
	}
}