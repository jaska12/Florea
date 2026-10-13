module.exports = {
	i18n: {
		defaultLocale: 'en',
		// the URL prefixes of the three languages; Korean is "kr" here and "ko" where a language tag is needed (libs/i18n/locale.ts)
		locales: ['en', 'kr', 'ru'],
		localeDetection: false,
	},
	// a text that a language does not have yet is shown in English, never as its key
	fallbackLng: 'en',
	defaultNS: 'common',
	// React escapes what it renders, so the values are passed as they are
	interpolation: { escapeValue: false },
	reloadOnPrerender: process.env.NODE_ENV === 'development',
	trailingSlash: true,
};
