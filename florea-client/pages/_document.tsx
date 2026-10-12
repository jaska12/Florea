import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/svg+xml" href="/img/logo/florea/favicon.svg" />
				<link rel="icon" type="image/png" sizes="32x32" href="/img/logo/florea/favicon-32.png" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/img/logo/florea/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />

				{/* SEO */}
				<meta name="keyword" content={'florea, flowers, bouquets, plants, gift boxes, flower delivery, florist'} />
				<meta
					name={'description'}
					content={
						'Order bouquets, plants and gift boxes from local florists and have them delivered. | ' +
						'Заказывайте букеты, растения и подарочные наборы у местных флористов с доставкой. | ' +
						'지역 플로리스트의 꽃다발, 식물, 선물 박스를 주문하고 배송받으세요.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
