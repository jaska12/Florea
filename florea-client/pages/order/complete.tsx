import { useFormat } from '../../libs/i18n/format';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { orderNumber } from '../../libs/components/order/OrderCard';
import { userVar } from '../../apollo/store';
import { GET_MY_ORDERS } from '../../apollo/user/query';
import { Order } from '../../libs/types/order/order';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// The page a buyer lands on right after placing an order: what was ordered, and where to follow it.
const OrderComplete: NextPage = () => {
	const { t } = useTranslation('order');
	const format = useFormat();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const ids: string[] = typeof router.query.ids === 'string' ? router.query.ids.split(',').filter(Boolean) : [];

	/** APOLLO REQUESTS **/
	const { loading: getOrdersLoading, data: getOrdersData } = useQuery(GET_MY_ORDERS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 30 } },
		skip: !user?._id || ids.length === 0,
		context: { silentError: true },
	});

	const orders: Order[] = (getOrdersData?.getMyOrders?.list ?? []).filter((order: Order) => ids.includes(order._id));
	const total = orders.reduce((sum, order) => sum + order.orderTotal, 0);

	return (
		<div id="order-complete-page" className={'shop-page'}>
			<div className={'container'}>
				<div className={'complete-box'}>
					<span className={'complete-icon'}>
						<CheckRoundedIcon />
					</span>
					<h2>{t('complete.title', { count: ids.length })}</h2>
					<p>
						{t('complete.note', { count: ids.length })}
					</p>

					{getOrdersLoading && orders.length === 0 && <div className={'complete-order skeleton'} />}

					{orders.map((order: Order) => {
						const pieces = (order.orderItems ?? []).reduce((sum, item) => sum + item.itemQuantity, 0);
						return (
							<div className={'complete-order'} key={order._id}>
								<div>
									<strong>{t('complete.orderNumber', { number: orderNumber(order) })}</strong>
									<span>
										{order.agentData?.memberNick
											? t('complete.itemsFrom', { count: pieces, name: order.agentData.memberNick })
											: t('complete.itemsCount', { count: pieces })}
									</span>
									<span>
										{format.weekday(order.deliveryDate)}
										{order.deliveryTime ? `, ${order.deliveryTime.replace('-', ' – ')}` : ''}
									</span>
									<span>
										{t('complete.to', { name: order.recipientName, address: order.deliveryAddress })}
									</span>
								</div>
								<em>{format.price(order.orderTotal)}</em>
							</div>
						);
					})}

					{orders.length > 0 && (
						<p className={'complete-total'}>
							{t('complete.toPayOnDelivery')} <strong>{format.price(total)}</strong>
						</p>
					)}

					<div className={'complete-actions'}>
						<Link href={'/mypage?category=myOrders'} className={'shop-btn'}>
							{t('complete.followMyOrders')}
						</Link>
						<Link href={'/product'} className={'shop-btn ghost'}>
							{t('complete.continueShopping')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderComplete);
