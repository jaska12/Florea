/** the languages of the site, as they appear in the address **/
export const LOCALES = ['en', 'kr', 'ru'] as const;
export type SiteLocale = (typeof LOCALES)[number];

// The address says "kr" for Korean; dates, numbers and the <html lang> attribute need the real language tag.
const LANGUAGE_TAG: Record<string, string> = { en: 'en-US', kr: 'ko-KR', ru: 'ru-RU' };

export const languageTag = (locale?: string): string => LANGUAGE_TAG[locale ?? 'en'] ?? LANGUAGE_TAG.en;

/** "ko" for <html lang> **/
export const htmlLang = (locale?: string): string => languageTag(locale).split('-')[0];

export const isSiteLocale = (value: unknown): value is SiteLocale => LOCALES.includes(value as SiteLocale);
