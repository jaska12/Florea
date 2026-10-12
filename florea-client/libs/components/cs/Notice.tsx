import React from 'react';
import { Stack, Box } from '@mui/material';

const Notice = () => {

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Ordering with delivery is open: pay in cash when your order arrives',
			date: '12.10.2026',
		},
		{
			no: 2,
			title: "Delivery is free when one florist's items come to $100 or more",
			date: '12.10.2026',
		},
		{
			no: 3,
			title: 'Notifications and the live chat are available to members',
			date: '11.10.2026',
		},
	];

	return (
		<Stack className={'notice-content'}>
			<span className={'title'}>Notice</span>
			<Stack className={'main'}>
				<Box component={'div'} className={'top'}>
					<span>number</span>
					<span>title</span>
					<span>date</span>
				</Box>
				<Stack className={'bottom'}>
					{data.map((ele: any) => (
						<div className={`notice-card ${ele?.event && 'event'}`} key={ele.title}>
							{ele?.event ? <div>event</div> : <span className={'notice-number'}>{ele.no}</span>}
							<span className={'notice-title'}>{ele.title}</span>
							<span className={'notice-date'}>{ele.date}</span>
						</div>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notice;
