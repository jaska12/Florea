import { useTranslation } from 'next-i18next';
import React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { OrderStatus, orderStatusFlow, orderStatusLabels } from '../../enums/order.enum';

interface OrderTimelineProps {
	orderStatus: OrderStatus;
}

// Placed → Confirmed → Preparing → Out for delivery → Delivered
const OrderTimeline = (props: OrderTimelineProps) => {
	const { t } = useTranslation('order');
	const { orderStatus } = props;

	if (orderStatus === OrderStatus.CANCELLED) {
		return <p className={'order-cancelled-note'}>{t('timeline.thisOrderWasCancelledThe')}</p>;
	}

	const current = orderStatusFlow.indexOf(orderStatus);

	return (
		<ol className={'order-timeline'} aria-label={`Order status: ${orderStatusLabels[orderStatus]}`}>
			{orderStatusFlow.map((step: OrderStatus, index: number) => {
				const state = index < current ? 'done' : index === current ? 'current' : 'todo';
				return (
					<li className={`step ${state}`} key={step} aria-current={state === 'current' ? 'step' : undefined}>
						<span className={'dot'}>{index <= current && <CheckRoundedIcon />}</span>
						<span className={'label'}>{orderStatusLabels[step]}</span>
					</li>
				);
			})}
		</ol>
	);
};

export default OrderTimeline;
