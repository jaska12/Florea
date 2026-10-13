import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { koKR, ruRU } from '@mui/material/locale';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { loadCart } from '../libs/cart';
import { useLocaleMemory } from '../libs/i18n/memory';
import { htmlLang } from '../libs/i18n/locale';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/theme/florea.scss';
import '../scss/theme/notifications.scss';
import '../scss/home/home.scss';
import '../scss/theme/order.scss';
import '../scss/theme/ai.scss';
import '../scss/mobile/main.scss';

/** the texts MUI components bring with them (pagination, rows per page), per site language **/
const MUI_TEXTS: Record<string, object> = { kr: koKR, ru: ruRU };

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const { locale } = router;
	// @ts-ignore
	const theme = useMemo(() => createTheme(light, MUI_TEXTS[locale ?? 'en'] ?? {}), [locale]);
	const client = useApollo(pageProps.initialApolloState);
	// the language chosen last time is used when the site is opened at an address without one
	useLocaleMemory();

	// On every navigation inside the site Next writes the locale of the address into <html lang>.
	// For Korean that is "kr", which is not the language tag; the server-rendered page already says "ko".
	useEffect(() => {
		const setLang = () => {
			document.documentElement.lang = htmlLang(locale);
		};
		setLang();
		router.events.on('routeChangeComplete', setLang);
		router.events.on('hashChangeComplete', setLang);
		return () => {
			router.events.off('routeChangeComplete', setLang);
			router.events.off('hashChangeComplete', setLang);
		};
	}, [locale, router.asPath]);

	useEffect(() => {
		loadCart();
		// another tab changed the cart
		window.addEventListener('storage', loadCart);
		return () => window.removeEventListener('storage', loadCart);
	}, []);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
