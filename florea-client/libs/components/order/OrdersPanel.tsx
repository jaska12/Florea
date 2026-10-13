import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Pagination } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import OrderCard from './OrderCard';
import { notificationPingVar } from '../../../apollo/store';
import { GET_AGENT_ORDERS, GET_MY_ORDERS } from '../../../apollo/user/query';
import { UPDATE_ORDER, UPDATE_ORDER_BY_AGENT } from '../../../apollo/user/mutation';
import { Order } from '../../types/order/order';
import { OrdersInquiry } from '../../types/order/order.input';
import { OrderStatus } from '../../enums/order.enum';
import { useEnumLabel } from '../../i18n/labels';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface OrdersPanelProps {
	/** 'buyer': the orders the member placed; 'agent': the orders placed in the member's shop **/
	role: 'buyer' | 'agent';
}

const LIMIT = 6;
const TABS: (OrderStatus | 'ALL')[] = [
	'ALL',
	OrderStatus.PENDING,
	OrderStatus.CONFIRMED,
	OrderStatus.PREPARING,
	OrderStatus.OUT_FOR_DELIVERY,
	OrderStatus.DELIVERED,
	OrderStatus.CANCELLED,
];

const OrdersPanel = (props: OrdersPanelProps) => {
	const { t } = useTranslation('order');
	const enumLabel = useEnumLabel();
	const { role } = props;
	const router = useRouter();
	const ping = useReactiveVar(notificationPingVar);
	const [tab, setTab] = useState<OrderStatus | 'ALL'>('ALL');
	const [page, setPage] = useState<number>(1);
	const [busyId, setBusyId] = useState<string>('');
	// an order opened from a notification arrives as ?orderId=
	const focusId = typeof router.query.orderId === 'string' ? router.query.orderId : '';
	const inquiry: OrdersInquiry = { page: page, limit: LIMIT, ...(tab === 'ALL' ? {} : { search: { orderStatus: tab } }) };
	const agent = role === 'agent';

	/** APOLLO REQUESTS **/
	const [updateOrder] = useMutation(agent ? UPDATE_ORDER_BY_AGENT : UPDATE_ORDER);

	const {
		loading: getOrdersLoading,
		data: getOrdersData,
		previousData: getOrdersPrevious,
		refetch: getOrdersRefetch,
	} = useQuery(agent ? GET_AGENT_ORDERS : GET_MY_ORDERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: inquiry },
		notifyOnNetworkStatusChange: true,
		// every refetch after a socket signal sends its own request (see NotificationBell)
		context: { queryDeduplication: false },
	});

	const result = (getOrdersData ?? getOrdersPrevious)?.[agent ? 'getAgentOrders' : 'getMyOrders'];
	const orders: Order[] = result?.list ?? [];
	const total: number = result?.metaCounter?.[0]?.total ?? 0;

	/** LIFECYCLES **/
	useEffect(() => {
		// a status change or a new order is announced over the socket
		if (ping) getOrdersRefetch({ input: inquiry }).catch(() => {});
	}, [ping]);

	useEffect(() => {
		if (!focusId || !orders.some((order) => order._id === focusId)) return;
		document.getElementById(`order-${focusId}`)?.scrollIntoView({ block: 'center' });
	}, [focusId, orders.length]);

	/** HANDLERS **/
	const tabHandler = (value: OrderStatus | 'ALL') => {
		setTab(value);
		setPage(1);
	};

	const changeStatusHandler = async (order: Order, orderStatus: OrderStatus) => {
		try {
			if (orderStatus === OrderStatus.CANCELLED && !(await sweetConfirmAlert(t('panel.cancelThisOrder')))) return;

			setBusyId(order._id);
			await updateOrder({ variables: { input: { _id: order._id, orderStatus: orderStatus } }, context: { silentError: true } });
			await getOrdersRefetch({ input: inquiry });
			await sweetTopSmallSuccessAlert(
				orderStatus === OrderStatus.CANCELLED ? t('panel.orderCancelled') : t(`panel.markedAs.${orderStatus}`),
				1400,
			);
		} catch (err: any) {
			sweetErrorHandling(err).then();
			getOrdersRefetch({ input: inquiry }).catch(() => {});
		} finally {
			setBusyId('');
		}
	};

	return (
		<div id="orders-page">
			<div className={'main-title-box'}>
				<div className={'right-box'}>
					<p className={'main-title'}>{agent ? t('panel.shopOrders') : t('panel.myOrders')}</p>
					<p className={'sub-title'}>
						{agent ? t('panel.ordersPlacedForYourProducts') : t('panel.followYourOrdersFromThe')}
					</p>
				</div>
			</div>

			<div className={'order-tabs'} role={'tablist'}>
				{TABS.map((value) => (
					<button
						type={'button'}
						role={'tab'}
						aria-selected={tab === value}
						className={tab === value ? 'on' : ''}
						onClick={() => tabHandler(value)}
						key={value}
					>
						{value === 'ALL' ? t('panel.all') : enumLabel('orderStatus', value)}
					</button>
				))}
			</div>

			<div className={'order-list'} aria-busy={getOrdersLoading}>
				{!result && getOrdersLoading ? (
					[0, 1, 2].map((row) => <div className={'order-card skeleton'} key={row} />)
				) : orders.length === 0 ? (
					<div className={'order-empty'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<strong>{tab === 'ALL' ? t('panel.noOrdersYet') : t(`panel.noOrders.${tab}`)}</strong>
						{!agent && tab === 'ALL' && (
							<Link href={'/product'} className={'order-btn'}>
								{t('panel.browseFlowersAndGifts')}
							</Link>
						)}
					</div>
				) : (
					orders.map((order: Order) => (
						<OrderCard
							order={order}
							role={role}
							defaultOpen={order._id === focusId}
							busy={busyId === order._id}
							onChangeStatus={changeStatusHandler}
							key={order._id}
						/>
					))
				)}
			</div>

			{total > LIMIT && (
				<div className={'order-pagination'}>
					<Pagination
						page={page}
						count={Math.ceil(total / LIMIT)}
						onChange={(e: any, value: number) => setPage(value)}
						shape="circular"
						color="primary"
					/>
				</div>
			)}
		</div>
	);
};

export default OrdersPanel;
