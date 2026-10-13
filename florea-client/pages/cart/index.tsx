import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { cartVar } from '../../apollo/store';
import { cartGroups, cartTotals, MAX_QUANTITY, removeFromCart, setCartQuantity } from '../../libs/cart';
import { CartGroup, CartItem } from '../../libs/types/cart/cart';
import { freeDeliveryFrom, REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Cart: NextPage = () => {
	const { t } = useTranslation('order');
	const router = useRouter();
	const items: CartItem[] = useReactiveVar(cartVar);
	// the cart is read from the browser after the first paint; until then nothing is claimed about it
	const [ready, setReady] = useState<boolean>(false);
	const groups: CartGroup[] = cartGroups(items);
	const totals = cartTotals(items);

	/** LIFECYCLES **/
	useEffect(() => {
		setReady(true);
	}, []);

	if (!ready) return <div id="cart-page" className={'shop-page'} />;

	if (items.length === 0) {
		return (
			<div id="cart-page" className={'shop-page'}>
				<div className={'container'}>
					<div className={'shop-empty'}>
						<span className={'shop-empty-icon'}>
							<ShoppingBagOutlinedIcon />
						</span>
						<strong>{t('cart.yourCartIsEmpty')}</strong>
						<p>{t('cart.chooseABouquetAPlant')}</p>
						<Link href={'/product'} className={'shop-btn'}>
							{t('cart.browseFlowersAndGifts')}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div id="cart-page" className={'shop-page'}>
			<div className={'container'}>
				<div className={'shop-columns'}>
					<div className={'shop-main'}>
						{groups.map((group: CartGroup) => (
							<section className={'shop-panel cart-group'} key={group.agentId}>
								<header>
									<span>
										From{' '}
										<Link href={`/agent/detail?agentId=${group.agentId}`}>{group.agentNick ?? t('cart.thisFlorist')}</Link>
									</span>
									<em>
										{group.delivery
											? `Add $${formatterStr(freeDeliveryFrom - group.subtotal)} more for free delivery`
											: t('cart.freeDelivery')}
									</em>
								</header>
								{group.items.map((item: CartItem) => {
									const limit = Math.min(item.productStock, MAX_QUANTITY);
									return (
										<div className={'cart-row'} key={item.productId}>
											<Link
												href={`/product/detail?id=${item.productId}`}
												className={'thumb'}
												style={item.productImage ? { backgroundImage: `url(${REACT_APP_API_URL}/${item.productImage})` } : undefined}
												aria-label={item.productTitle}
											/>
											<div className={'cart-name'}>
												<Link href={`/product/detail?id=${item.productId}`}>{item.productTitle}</Link>
												<span>${formatterStr(item.productPrice)} each</span>
											</div>
											<div className={'qty'} role={'group'} aria-label={`Quantity of ${item.productTitle}`}>
												<button
													type={'button'}
													aria-label={t('cart.oneLess')}
													disabled={item.quantity <= 1}
													onClick={() => setCartQuantity(item.productId, item.quantity - 1)}
												>
													<RemoveRoundedIcon />
												</button>
												<span aria-live={'polite'}>{item.quantity}</span>
												<button
													type={'button'}
													aria-label={t('cart.oneMore')}
													disabled={item.quantity >= limit}
													onClick={() => setCartQuantity(item.productId, item.quantity + 1)}
												>
													<AddRoundedIcon />
												</button>
											</div>
											<strong className={'cart-sum'}>${formatterStr(item.productPrice * item.quantity)}</strong>
											<button
												type={'button'}
												className={'cart-remove'}
												aria-label={`Remove ${item.productTitle}`}
												onClick={() => removeFromCart(item.productId)}
											>
												<DeleteOutlineRoundedIcon />
											</button>
										</div>
									);
								})}
							</section>
						))}
						<Link href={'/product'} className={'shop-link'}>
							{t('cart.continueShopping')}
						</Link>
					</div>

					<aside className={'shop-side'}>
						<section className={'shop-panel shop-summary'}>
							<h3>{t('cart.summary')}</h3>
							<dl>
								<div>
									<dt>
										{totals.count} item{totals.count === 1 ? '' : 's'}
									</dt>
									<dd>${formatterStr(totals.subtotal)}</dd>
								</div>
								<div>
									<dt>Delivery{groups.length > 1 ? ` (${groups.length} florists)` : ''}</dt>
									<dd>{totals.delivery ? `$${formatterStr(totals.delivery)}` : t('cart.free')}</dd>
								</div>
								<div className={'total'}>
									<dt>{t('cart.total')}</dt>
									<dd>${formatterStr(totals.total)}</dd>
								</div>
							</dl>
							{groups.length > 1 && (
								<p className={'shop-note'}>
									Your cart has products from {groups.length} florists. Each florist delivers separately, so this becomes{' '}
									{groups.length} orders.
								</p>
							)}
							<button type={'button'} className={'shop-btn'} onClick={() => router.push('/checkout')}>
								{t('cart.checkout')}
							</button>
							<p className={'shop-pay'}>{t('cart.cashOnDeliveryYouPay')}</p>
						</section>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(Cart);
