import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { loadCart } from '../libs/cart';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/theme/florea.scss';
import '../scss/theme/notifications.scss';
import '../scss/home/home.scss';
import '../scss/theme/order.scss';
import '../scss/theme/ai.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

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
