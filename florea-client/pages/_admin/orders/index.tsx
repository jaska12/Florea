import { useFormat } from '../../../libs/i18n/format';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import type { NextPage } from 'next';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import {
	Box,
	Divider,
	List,
	ListItem,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_ORDERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_ORDER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Order } from '../../../libs/types/order/order';
import { OrdersInquiry } from '../../../libs/types/order/order.input';
import {
	cancellableOrderStatuses,
	OrderStatus,
	orderStatusFlow,
	orderStatusLabels,
} from '../../../libs/enums/order.enum';
import { orderNumber } from '../../../libs/components/order/OrderCard';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';

const TABS: (OrderStatus | 'ALL')[] = ['ALL', ...orderStatusFlow, OrderStatus.CANCELLED];

/** the statuses an order may be moved to from where it is now **/
const nextStatuses = (orderStatus: OrderStatus): OrderStatus[] => {
	const step = orderStatusFlow.indexOf(orderStatus);
	const forward = step === -1 ? [] : orderStatusFlow.slice(step + 1);
	return cancellableOrderStatuses.includes(orderStatus) ? [...forward, OrderStatus.CANCELLED] : forward;
};

const AdminOrders: NextPage = () => {
	const { t } = useTranslation('admin');
	const format = useFormat();
	const [tab, setTab] = useState<OrderStatus | 'ALL'>('ALL');
	const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(10);
	const inquiry: OrdersInquiry = { page: page + 1, limit: limit, ...(tab === 'ALL' ? {} : { search: { orderStatus: tab } }) };

	/** APOLLO REQUESTS **/
	const [updateOrderByAdmin] = useMutation(UPDATE_ORDER_BY_ADMIN);

	const { data: getOrdersData, refetch: getOrdersRefetch } = useQuery(GET_ALL_ORDERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: inquiry },
		notifyOnNetworkStatusChange: true,
	});

	const orders: Order[] = getOrdersData?.getAllOrdersByAdmin?.list ?? [];
	const total: number = getOrdersData?.getAllOrdersByAdmin?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/
	const tabChangeHandler = (value: OrderStatus | 'ALL') => {
		setTab(value);
		setPage(0);
	};

	const statusChangeHandler = async (order: Order, orderStatus: OrderStatus) => {
		try {
			if (orderStatus === OrderStatus.CANCELLED && !(await sweetConfirmAlert(`Cancel order ${orderNumber(order)}?`))) return;

			await updateOrderByAdmin({
				variables: { input: { _id: order._id, orderStatus: orderStatus } },
				context: { silentError: true },
			});
			await getOrdersRefetch({ input: inquiry });
			await sweetTopSmallSuccessAlert(`${orderNumber(order)}: ${orderStatusLabels[orderStatus]}`, 1400);
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				{t('orders.orderList')}
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<List className={'tab-menu'}>
						{TABS.map((value) => (
							<ListItem onClick={() => tabChangeHandler(value)} className={tab === value ? 'li on' : 'li'} key={value}>
								{value === 'ALL' ? t('orders.all') : orderStatusLabels[value]}
							</ListItem>
						))}
					</List>
					<Divider />
					<TableContainer>
						<Table sx={{ minWidth: 900 }} size={'medium'}>
							<TableHead>
								<TableRow>
									<TableCell>{t('orders.order')}</TableCell>
									<TableCell>{t('orders.placed')}</TableCell>
									<TableCell>{t('orders.buyer')}</TableCell>
									<TableCell>{t('orders.florist')}</TableCell>
									<TableCell>{t('orders.items')}</TableCell>
									<TableCell>{t('orders.total')}</TableCell>
									<TableCell>{t('orders.delivery')}</TableCell>
									<TableCell>{t('orders.status')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{orders.length === 0 && (
									<TableRow>
										<TableCell align="center" colSpan={8}>
											<span className={'no-data'}>{t('orders.dataNotFound')}</span>
										</TableCell>
									</TableRow>
								)}
								{orders.map((order: Order) => {
									const options = nextStatuses(order.orderStatus);
									const items = order.orderItems ?? [];
									return (
										<TableRow hover key={order._id}>
											<TableCell>{orderNumber(order)}</TableCell>
											<TableCell>{format.dateTime(order.createdAt)}</TableCell>
											<TableCell>{order.memberData?.memberNick}</TableCell>
											<TableCell>{order.agentData?.memberNick}</TableCell>
											<TableCell>
												{items.map((item) => `${item.itemQuantity} × ${item.productData?.productTitle ?? 'Product'}`).join(', ')}
											</TableCell>
											<TableCell>{format.price(order.orderTotal)}</TableCell>
											<TableCell>
												{format.date(order.deliveryDate, 'short')}
												{order.deliveryTime ? `, ${order.deliveryTime}` : ''}
												<br />
												{order.recipientName}, {order.deliveryAddress}
											</TableCell>
											<TableCell>
												{options.length === 0 ? (
													<span className={`badge ${order.orderStatus === OrderStatus.DELIVERED ? 'success' : 'delete'}`}>
														{orderStatusLabels[order.orderStatus]}
													</span>
												) : (
													<Select
														size={'small'}
														value={order.orderStatus}
														sx={{ minWidth: 170 }}
														onChange={(e) => statusChangeHandler(order, e.target.value as OrderStatus)}
														inputProps={{ 'aria-label': `Status of order ${orderNumber(order)}` }}
													>
														<MenuItem value={order.orderStatus} disabled>
															{orderStatusLabels[order.orderStatus]}
														</MenuItem>
														{options.map((status: OrderStatus) => (
															<MenuItem value={status} key={status}>
																{orderStatusLabels[status]}
															</MenuItem>
														))}
													</Select>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 20, 40]}
						component="div"
						count={total}
						rowsPerPage={limit}
						page={page}
						onPageChange={(e: unknown, newPage: number) => setPage(newPage)}
						onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setLimit(parseInt(e.target.value, 10));
							setPage(0);
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminOrders);
