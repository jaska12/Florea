import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isSiteLocale } from './locale';

const STORAGE_KEY = 'locale';

/** called when the visitor chooses a language in the navbar **/
export const rememberLocale = (locale: string): void => {
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		// private mode: the choice lasts as long as the address keeps its prefix
	}
};

/**
 * The language is part of the address (/kr/..., /ru/...), so a reload and every link inside the site keep it.
 * What the address cannot do is remember the choice when the site is opened again without a prefix:
 * then the page is English, and this hook moves it to the language chosen last time.
 * An address that names a language is always respected, and becomes the remembered one.
 */
export const useLocaleMemory = (): void => {
	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch {
			return;
		}
		if (router.locale && router.locale !== router.defaultLocale) {
			if (stored !== router.locale) rememberLocale(router.locale);
			return;
		}
		if (isSiteLocale(stored) && stored !== router.locale) {
			router.replace(router.asPath, router.asPath, { locale: stored }).then();
		}
	}, [router.isReady, router.locale, router.asPath]);
};
