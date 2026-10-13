import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { htmlLang } from '../libs/i18n/locale';

// The description and the keywords of the site are set by the layouts, in the language of the page.
export default function Document(props: DocumentProps) {
	return (
		<Html lang={htmlLang(props.__NEXT_DATA__.locale)}>
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/svg+xml" href="/img/logo/florea/favicon.svg" />
				<link rel="icon" type="image/png" sizes="32x32" href="/img/logo/florea/favicon-32.png" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/img/logo/florea/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />

			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
