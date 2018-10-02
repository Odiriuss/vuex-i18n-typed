using System.Globalization;
using Agrivi.Translations.Helpers;

namespace Agrivi.Translations.Resources.Modules 
{
	public static class General 
	{
        private const TranslationModule _module = TranslationModule.General;

		public static string GetString(string key, CultureInfo cultureInfo = null) => typeof(General).GetString(key, cultureInfo);

		public static TranslationBase _30dayss = new TranslationBase(_module, "_30dayss");
		public static TranslationBase _7days = new TranslationBase(_module, "_7days");
    }
}