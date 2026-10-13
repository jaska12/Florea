import { i18n } from 'next-i18next';

/**
 * A translation outside React: alerts, cart messages, the login helpers.
 * The English text is given with the key and is what is shown if the key cannot be read, so a key never reaches the screen.
 */
export const tr = (key: string, english: string, values?: Record<string, unknown>): string => {
	const translated = i18n?.t(key, { defaultValue: english, ...values });
	if (typeof translated === 'string' && translated !== key) return translated;
	return english.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(values?.[name] ?? ''));
};
