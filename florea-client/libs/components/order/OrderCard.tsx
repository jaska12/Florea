import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import OrderTimeline from './OrderTimeline';
import { Order, OrderItem } from '../../types/order/order';
import { cancellableOrderStatuses, OrderStatus, orderStatusFlow, orderStatusLabels } from '../../enums/order.enum';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface OrderCardProps {
	order: Order;
	/** who is looking: the buyer sees the florist and may cancel; the florist or an admin moves the order on **/
	role: 'buyer' | 'agent' | 'admin';
	defaultOpen?: boolean;
	busy?: boolean;
	onChangeStatus: (order: Order, orderStatus: OrderStatus) => void;
}

/** the short number people can read out: the end of the id **/
export const orderNumber = (order: Order): string => `#${order._id.slice(-6).toUpperCase()}`;

const OrderCard = (props: OrderCardProps) => {
	const { t } = useTranslation('order');
	const { order, role, defaultOpen = false, busy = false, onChangeStatus } = props;
	const [open, setOpen] = useState<boolean>(defaultOpen);
	const items: OrderItem[] = order.orderItems ?? [];
	const pieces = items.reduce((sum, item) => sum + item.itemQuantity, 0);
	const itemsTotal = order.orderTotal - order.orderDelivery;
	const nextStatus = orderStatusFlow[orderStatusFlow.indexOf(order.orderStatus) + 1];
	const canCancel =
		role === 'buyer'
			? order.orderStatus === OrderStatus.PENDING
			: cancellableOrderStatuses.includes(order.orderStatus);
	const other = role === 'buyer' ? order.agentData : order.memberData;

	return (
		<article className={`order-card ${open ? 'open' : ''}`} id={`order-${order._id}`}>
			<button type={'button'} className={'order-head'} onClick={() => setOpen(!open)} aria-expanded={open}>
				<span className={'order-thumbs'}>
					{items.slice(0, 3).map((item) => {
						const image = item.productData?.productImages?.[0];
						return (
							<span
								className={'thumb'}
								key={item._id}
								style={image ? { backgroundImage: `url(${REACT_APP_API_URL}/${image})` } : undefined}
							/>
						);
					})}
				</span>
				<span className={'order-main'}>
					<strong>
						{items[0]?.productData?.productTitle ?? t('card.order')}
						{items.length > 1 && <em> +{items.length - 1} more</em>}
					</strong>
					<span className={'order-meta'}>
						{orderNumber(order)} · {moment(order.createdAt).format('D MMM YYYY')} · {pieces} item{pieces === 1 ? '' : 's'}
						{role === 'admin' && ` · ${order.memberData?.memberNick ?? ''} → ${order.agentData?.memberNick ?? ''}`}
						{role !== 'admin' && other?.memberNick && ` · ${role === 'buyer' ? 'from' : 'for'} ${other.memberNick}`}
					</span>
				</span>
				<span className={'order-side'}>
					<span className={`order-status ${order.orderStatus.toLowerCase()}`}>{orderStatusLabels[order.orderStatus]}</span>
					<span className={'order-total'}>${formatterStr(order.orderTotal)}</span>
				</span>
				<KeyboardArrowDownRoundedIcon className={'order-caret'} />
			</button>

			{open && (
				<div className={'order-body'}>
					<OrderTimeline orderStatus={order.orderStatus} />

					<div className={'order-columns'}>
						<section className={'order-items'}>
							<h4>{t('card.items')}</h4>
							{items.map((item) => {
								const image = item.productData?.productImages?.[0];
								return (
									<div className={'order-item'} key={item._id}>
										<span
											className={'thumb'}
											style={image ? { backgroundImage: `url(${REACT_APP_API_URL}/${image})` } : undefined}
										/>
										<span className={'name'}>
											<Link href={`/product/detail?id=${item.productId}`}>{item.productData?.productTitle ?? t('card.product')}</Link>
											<span>
												{item.itemQuantity} × ${formatterStr(item.itemPrice)}
											</span>
										</span>
										<span className={'sum'}>${formatterStr(item.itemQuantity * item.itemPrice)}</span>
									</div>
								);
							})}
							<dl className={'order-sums'}>
								<div>
									<dt>{t('card.items')}</dt>
									<dd>${formatterStr(itemsTotal)}</dd>
								</div>
								<div>
									<dt>{t('card.delivery')}</dt>
									<dd>{order.orderDelivery ? `$${formatterStr(order.orderDelivery)}` : t('card.free')}</dd>
								</div>
								<div className={'total'}>
									<dt>{t('card.totalCashOnDelivery')}</dt>
									<dd>${formatterStr(order.orderTotal)}</dd>
								</div>
							</dl>
						</section>

						<section className={'order-delivery'}>
							<h4>{t('card.delivery')}</h4>
							<dl>
								<div>
									<dt>{t('card.recipient')}</dt>
									<dd>
										{order.recipientName}
										<br />
										{order.recipientPhone}
									</dd>
								</div>
								<div>
									<dt>{t('card.address')}</dt>
									<dd>{order.deliveryAddress}</dd>
								</div>
								<div>
									<dt>{t('card.when')}</dt>
									<dd>
										{moment(order.deliveryDate).format('dddd, D MMMM YYYY')}
										{order.deliveryTime && (
											<>
												<br />
												{order.deliveryTime.replace('-', ' – ')}
											</>
										)}
									</dd>
								</div>
								{order.cardMessage && (
									<div>
										<dt>{t('card.cardMessage')}</dt>
										<dd className={'card-message'}>“{order.cardMessage}”</dd>
									</div>
								)}
								{other?.memberNick && (
									<div>
										<dt>{role === 'buyer' ? t('card.florist') : t('card.buyer')}</dt>
										<dd>
											{role === 'buyer' ? (
												<Link href={`/agent/detail?agentId=${order.agentId}`}>{other.memberNick}</Link>
											) : (
												other.memberNick
											)}
											{other.memberPhone && (
												<>
													<br />
													{other.memberPhone}
												</>
											)}
										</dd>
									</div>
								)}
							</dl>
						</section>
					</div>

					{(canCancel || (role !== 'buyer' && nextStatus)) && (
						<div className={'order-actions'}>
							{canCancel && (
								<button
									type={'button'}
									className={'order-btn ghost'}
									disabled={busy}
									onClick={() => onChangeStatus(order, OrderStatus.CANCELLED)}
								>
									{t('card.cancelOrder')}
								</button>
							)}
							{role !== 'buyer' && nextStatus && (
								<button type={'button'} className={'order-btn'} disabled={busy} onClick={() => onChangeStatus(order, nextStatus)}>
									Mark as {orderStatusLabels[nextStatus].toLowerCase()}
								</button>
							)}
						</div>
					)}
					{role === 'buyer' && cancellableOrderStatuses.includes(order.orderStatus) && !canCancel && (
						<p className={'order-hint'}>{t('card.theFloristIsWorkingOn')}</p>
					)}
				</div>
			)}
		</article>
	);
};

export default OrderCard;
