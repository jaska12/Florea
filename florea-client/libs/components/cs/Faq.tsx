import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const router = useRouter();
	const [category, setCategory] = useState<string>('product');
	const [expanded, setExpanded] = useState<string | false>('faq-product-1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	
	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		product: [
			{
				id: 'faq-product-1',
				subject: 'What can I order on Florea?',
				content: 'Bouquets, flower boxes, plants, gift boxes, sweets and toys from local florists and gift shops.',
			},
			{
				id: 'faq-product-2',
				subject: 'How do I find something for an occasion?',
				content:
					'On the Products page, filter by occasion (birthday, wedding, anniversary, love, congratulations, sympathy), by category, size, location and price. The homepage has shortcuts for the most common occasions.',
			},
			{
				id: 'faq-product-3',
				subject: 'What do "Same day" and "Gift wrap" on a product mean?',
				content:
					'The florist offers same-day delivery, or gift wrapping, for that product. You can also filter the product list by these two options.',
			},
			{
				id: 'faq-product-4',
				subject: 'What does "Out of stock" mean?',
				content:
					'The florist has none left at the moment, so the product cannot be added to the cart. It can be ordered again when the florist adds stock.',
			},
			{
				id: 'faq-product-5',
				subject: 'Who makes the products?',
				content:
					"Every product shows the florist behind it. Open the florist's page to see their other products and the reviews customers left.",
			},
		],
		payment: [
			{
				id: 'faq-payment-1',
				subject: 'How do I pay?',
				content: 'Cash on delivery: you pay when the order arrives. Florea does not take online payments yet.',
			},
			{
				id: 'faq-payment-2',
				subject: 'How much is delivery?',
				content: "Delivery is $5 for each order. It is free when the items of that order come to $100 or more.",
			},
			{
				id: 'faq-payment-3',
				subject: 'Why does my cart turn into more than one order?',
				content:
					'Each florist prepares and delivers their own products. If your cart has products from two florists, it becomes two orders, each with its own delivery fee and its own status.',
			},
			{
				id: 'faq-payment-4',
				subject: 'Can the price change after I place the order?',
				content: 'No. An order keeps the prices it was placed with.',
			},
		],
		buyers: [
			{
				id: 'faq-orders-1',
				subject: 'How do I place an order?',
				content:
					'Add products to the cart, open the cart and go to checkout. Enter who receives the order, the address, the delivery date and time, and, if you like, a message for the gift card. You need to be logged in to place the order.',
			},
			{
				id: 'faq-orders-2',
				subject: 'Can I send an order to someone else?',
				content: 'Yes. At checkout you enter the name and phone number of the person who will receive it.',
			},
			{
				id: 'faq-orders-3',
				subject: 'When will it be delivered?',
				content: 'You choose the delivery date and one of four time slots between 09:00 and 21:00.',
			},
			{
				id: 'faq-orders-4',
				subject: 'How do I follow my order?',
				content:
					'My Page → My Orders shows each order with its steps: Placed, Confirmed, Preparing, Out for delivery, Delivered. You also get a notification at every step.',
			},
			{
				id: 'faq-orders-5',
				subject: 'Can I cancel an order?',
				content:
					'Yes, in My Page → My Orders, while the order is still "Placed". Once the florist has confirmed it, call the florist; their phone number is on the order.',
			},
			{
				id: 'faq-orders-6',
				subject: 'Is my cart saved?',
				content: 'The cart is kept in the browser you used until you place the order. It is not shared with your other devices.',
			},
		],
		agents: [
			{
				id: 'faq-florists-1',
				subject: 'How do I sell on Florea?',
				content: 'Sign up and choose "Agent" as the account type. Then open My Page → Add Product.',
			},
			{
				id: 'faq-florists-2',
				subject: 'Where do I see my orders?',
				content:
					'My Page → Shop Orders. You get a notification for each new order, and you move it on as you work: Confirmed, Preparing, Out for delivery, Delivered. The buyer is told at every step.',
			},
			{
				id: 'faq-florists-3',
				subject: 'How does stock work?',
				content:
					'The stock of a product goes down when it is ordered and comes back if the order is cancelled. At zero the product shows "Out of stock". You change the stock by editing the product in My Page → My Products.',
			},
			{
				id: 'faq-florists-4',
				subject: 'Can I cancel an order?',
				content: 'Yes, until it is out for delivery. The buyer is notified and the stock comes back.',
			},
			{
				id: 'faq-florists-5',
				subject: 'Who delivers the order?',
				content: 'You do. Each florist delivers their own orders to the address and at the time the buyer chose.',
			},
		],
		membership: [
			{
				id: 'faq-account-1',
				subject: 'Is an account free?',
				content: 'Yes, for buyers and for florists.',
			},
			{
				id: 'faq-account-2',
				subject: 'What do I need an account for?',
				content:
					'To place orders, like products, leave reviews, follow florists, write in the community and use the live chat. Browsing and filling the cart work without one.',
			},
			{
				id: 'faq-account-3',
				subject: 'How do I change my photo, phone or address?',
				content: 'In My Page → My Profile. The address there is filled in for you at checkout.',
			},
			{
				id: 'faq-account-4',
				subject: 'Which languages does Florea have?',
				content: 'English, Korean and Russian. Use the flag in the top bar, or the language buttons in the menu on a phone.',
			},
			{
				id: 'faq-account-5',
				subject: 'I forgot my password. What now?',
				content: 'Password reset is not available on the site yet. Please call customer care at +82 10 4867 2909.',
			},
		],
		community: [
			{
				id: 'faq-community-1',
				subject: 'What is the community?',
				content: 'Boards where members write articles: Free Board, Recommendation, News and Humor.',
			},
			{
				id: 'faq-community-2',
				subject: 'How do I write an article?',
				content: 'Log in and open My Page → Write Article, or press "Write" on the Community page.',
			},
			{
				id: 'faq-community-3',
				subject: 'What is the live chat?',
				content:
					'One shared room for members who are logged in; the button is at the bottom right of the page. Messages are not stored, so it is for quick questions, not for records.',
			},
			{
				id: 'faq-community-4',
				subject: 'Will I know when someone likes or comments on my article?',
				content: 'Yes. Likes, comments and new followers appear under the bell in the top bar.',
			},
		],
		other: [
			{
				id: 'faq-other-1',
				subject: 'What are the notifications under the bell?',
				content:
					'News about your account: likes, comments, new followers, and every step of your orders. Press one to open what it is about.',
			},
			{
				id: 'faq-other-2',
				subject: 'Does Florea work on a phone?',
				content: 'Yes. Every page is laid out for phones and tablets as well as for a computer.',
			},
			{
				id: 'faq-other-3',
				subject: 'How do I reach customer care?',
				content: 'Call +82 10 4867 2909.',
			},
		],
	};

	return (
		<Stack className={'faq-content'}>
			<Box className={'categories'} component={'div'}>
				<div
					className={category === 'product' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('product');
					}}
				>
					Product
				</div>
				<div
					className={category === 'payment' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('payment');
					}}
				>
					Payment
				</div>
				<div
					className={category === 'buyers' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('buyers');
					}}
				>
					Orders
				</div>
				<div
					className={category === 'agents' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('agents');
					}}
				>
					For Florists
				</div>
				<div
					className={category === 'membership' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('membership');
					}}
				>
					Account
				</div>
				<div
					className={category === 'community' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('community');
					}}
				>
					Community
				</div>
				<div
					className={category === 'other' ? 'active' : ''}
					onClick={() => {
						changeCategoryHandler('other');
					}}
				>
					Other
				</div>
			</Box>
			<Box className={'wrap'} component={'div'}>
				{data[category] &&
					data[category].map((ele: any) => (
						<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
							<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
								<Typography className="badge" variant={'h4'}>
									Q
								</Typography>
								<Typography> {ele?.subject}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer flex-box'}>
									<Typography className="badge" variant={'h4'} color={'primary'}>
										A
									</Typography>
									<Typography> {ele?.content}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</Stack>
	);
};

export default Faq;
