import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { cartVar, userVar } from '../../apollo/store';
import { CREATE_ORDER } from '../../apollo/user/mutation';
import { cartGroups, cartTotals, clearCart } from '../../libs/cart';
import { CartGroup, CartItem } from '../../libs/types/cart/cart';
import { OrderInput } from '../../libs/types/order/order.input';
import { deliveryTimeSlots, REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface CheckoutForm {
	recipientName: string;
	recipientPhone: string;
	deliveryAddress: string;
	deliveryDate: string;
	deliveryTime: string;
	cardMessage: string;
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

const CARD_MESSAGE_MAX = 300;

/** what is wrong with the form, field by field, in words the buyer can act on **/
const validate = (form: CheckoutForm): FormErrors => {
	const errors: FormErrors = {};
	const name = form.recipientName.trim();
	const phone = form.recipientPhone.trim();
	const address = form.deliveryAddress.trim();

	if (name.length < 2) errors.recipientName = "Enter the recipient's name.";
	if (!/^[0-9+\-\s()]{5,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
		errors.recipientPhone = 'Enter a phone number the courier can call, for example 010 1234 5678.';
	}
	if (address.length < 5) errors.deliveryAddress = 'Enter the full delivery address: street, building and unit.';
	if (!form.deliveryDate) errors.deliveryDate = 'Choose the delivery date.';
	else if (moment(form.deliveryDate).isBefore(moment().startOf('day'))) errors.deliveryDate = 'The delivery date cannot be in the past.';
	if (!form.deliveryTime) errors.deliveryTime = 'Choose a delivery time.';

	return errors;
};

const Checkout: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const items: CartItem[] = useReactiveVar(cartVar);
	const groups: CartGroup[] = cartGroups(items);
	const totals = cartTotals(items);
	const [ready, setReady] = useState<boolean>(false);
	const [form, setForm] = useState<CheckoutForm>({
		recipientName: '',
		recipientPhone: '',
		deliveryAddress: '',
		deliveryDate: '',
		deliveryTime: '',
		cardMessage: '',
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [serverError, setServerError] = useState<string>('');
	const [placing, setPlacing] = useState<boolean>(false);
	// once the order is placed the cart is emptied; the page must not flash "your cart is empty" on the way out
	const placed = useRef<boolean>(false);
	const today = moment().format('YYYY-MM-DD');

	/** APOLLO REQUESTS **/
	const [createOrder] = useMutation(CREATE_ORDER);

	/** LIFECYCLES **/
	useEffect(() => {
		setReady(true);
	}, []);

	useEffect(() => {
		// the member's own address is the likely place; they can change it
		const address = user?.memberAddress;
		if (address) setForm((prev) => (prev.deliveryAddress ? prev : { ...prev, deliveryAddress: address }));
	}, [user?.memberAddress]);

	/** HANDLERS **/
	const changeHandler = (field: keyof CheckoutForm, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const placeOrderHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (placing) return;

		const found = validate(form);
		setErrors(found);
		setServerError('');
		const firstWrong = Object.keys(found)[0];
		if (firstWrong) {
			document.getElementById(`checkout-${firstWrong}`)?.focus();
			return;
		}

		try {
			setPlacing(true);
			const input: OrderInput = {
				items: items.map((item) => ({ productId: item.productId, itemQuantity: item.quantity })),
				recipientName: form.recipientName.trim(),
				recipientPhone: form.recipientPhone.trim(),
				deliveryAddress: form.deliveryAddress.trim(),
				// noon keeps the chosen day the same day in every time zone
				deliveryDate: moment(form.deliveryDate).hour(12).toISOString(),
				deliveryTime: form.deliveryTime,
				...(form.cardMessage.trim() ? { cardMessage: form.cardMessage.trim() } : {}),
			};
			// the message is shown on the page, beside the button, so the alert is not opened as well
			const result = await createOrder({ variables: { input }, context: { silentError: true } });
			const ids: string[] = (result.data?.createOrder ?? []).map((order: { _id: string }) => order._id);

			placed.current = true;
			await router.push(`/order/complete?ids=${ids.join(',')}`);
			clearCart();
		} catch (err: any) {
			setServerError(err?.graphQLErrors?.[0]?.message ?? 'The order could not be placed. Please try again.');
			setPlacing(false);
		}
	};

	if (!ready) return <div id="checkout-page" className={'shop-page'} />;

	if (!user?._id) {
		return (
			<div id="checkout-page" className={'shop-page'}>
				<div className={'container'}>
					<div className={'shop-empty'}>
						<strong>Log in to place your order</strong>
						<p>Your cart is saved in this browser and will still be here when you come back.</p>
						<Link href={'/account/join'} className={'shop-btn'}>
							Log in or sign up
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (items.length === 0 && !placed.current) {
		return (
			<div id="checkout-page" className={'shop-page'}>
				<div className={'container'}>
					<div className={'shop-empty'}>
						<strong>There is nothing to check out</strong>
						<p>Your cart is empty.</p>
						<Link href={'/product'} className={'shop-btn'}>
							Browse flowers and gifts
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div id="checkout-page" className={'shop-page'}>
			<div className={'container'}>
				<form className={'shop-columns'} onSubmit={placeOrderHandler} noValidate>
					<div className={'shop-main'}>
						<section className={'shop-panel'}>
							<h3>Who receives it</h3>
							<div className={'field-row'}>
								<label className={`field ${errors.recipientName ? 'wrong' : ''}`}>
									<span>Recipient name</span>
									<input
										id="checkout-recipientName"
										type="text"
										autoComplete="name"
										maxLength={60}
										placeholder={'The person who will receive the order'}
										value={form.recipientName}
										onChange={(e) => changeHandler('recipientName', e.target.value)}
										aria-invalid={Boolean(errors.recipientName)}
									/>
									{errors.recipientName && <em role={'alert'}>{errors.recipientName}</em>}
								</label>
								<label className={`field ${errors.recipientPhone ? 'wrong' : ''}`}>
									<span>Recipient phone</span>
									<input
										id="checkout-recipientPhone"
										type="tel"
										inputMode="tel"
										autoComplete="tel"
										maxLength={20}
										placeholder={'010 1234 5678'}
										value={form.recipientPhone}
										onChange={(e) => changeHandler('recipientPhone', e.target.value)}
										aria-invalid={Boolean(errors.recipientPhone)}
									/>
									{errors.recipientPhone && <em role={'alert'}>{errors.recipientPhone}</em>}
								</label>
							</div>
						</section>

						<section className={'shop-panel'}>
							<h3>Where and when</h3>
							<label className={`field ${errors.deliveryAddress ? 'wrong' : ''}`}>
								<span>Delivery address</span>
								<input
									id="checkout-deliveryAddress"
									type="text"
									autoComplete="street-address"
									maxLength={200}
									placeholder={'Street, building, unit'}
									value={form.deliveryAddress}
									onChange={(e) => changeHandler('deliveryAddress', e.target.value)}
									aria-invalid={Boolean(errors.deliveryAddress)}
								/>
								{errors.deliveryAddress && <em role={'alert'}>{errors.deliveryAddress}</em>}
							</label>
							<div className={'field-row'}>
								<label className={`field ${errors.deliveryDate ? 'wrong' : ''}`}>
									<span>Delivery date</span>
									<input
										id="checkout-deliveryDate"
										type="date"
										min={today}
										value={form.deliveryDate}
										onChange={(e) => changeHandler('deliveryDate', e.target.value)}
										aria-invalid={Boolean(errors.deliveryDate)}
									/>
									{errors.deliveryDate && <em role={'alert'}>{errors.deliveryDate}</em>}
								</label>
								<fieldset className={`field ${errors.deliveryTime ? 'wrong' : ''}`}>
									<legend>Delivery time</legend>
									<div className={'slots'}>
										{deliveryTimeSlots.map((slot: string, index: number) => (
											<button
												type={'button'}
												id={index === 0 ? 'checkout-deliveryTime' : undefined}
												className={form.deliveryTime === slot ? 'on' : ''}
												aria-pressed={form.deliveryTime === slot}
												onClick={() => changeHandler('deliveryTime', slot)}
												key={slot}
											>
												{slot.replace('-', ' – ')}
											</button>
										))}
									</div>
									{errors.deliveryTime && <em role={'alert'}>{errors.deliveryTime}</em>}
								</fieldset>
							</div>
						</section>

						<section className={'shop-panel'}>
							<h3>
								Gift card message <small>optional</small>
							</h3>
							<label className={'field'}>
								<span className={'sr-only'}>Gift card message</span>
								<textarea
									id="checkout-cardMessage"
									rows={3}
									maxLength={CARD_MESSAGE_MAX}
									placeholder={'A few words to print on the card'}
									value={form.cardMessage}
									onChange={(e) => changeHandler('cardMessage', e.target.value)}
								/>
								<small className={'counter'}>
									{form.cardMessage.length} / {CARD_MESSAGE_MAX}
								</small>
							</label>
						</section>

						<Link href={'/cart'} className={'shop-link'}>
							← Back to cart
						</Link>
					</div>

					<aside className={'shop-side'}>
						<section className={'shop-panel shop-summary'}>
							<h3>Your order</h3>
							{groups.map((group: CartGroup) => (
								<div className={'summary-group'} key={group.agentId}>
									<span className={'summary-shop'}>From {group.agentNick ?? 'this florist'}</span>
									{group.items.map((item: CartItem) => (
										<div className={'summary-item'} key={item.productId}>
											<span
												className={'thumb'}
												style={item.productImage ? { backgroundImage: `url(${REACT_APP_API_URL}/${item.productImage})` } : undefined}
											/>
											<span className={'name'}>
												{item.productTitle}
												<small>
													{item.quantity} × ${formatterStr(item.productPrice)}
												</small>
											</span>
											<span className={'sum'}>${formatterStr(item.productPrice * item.quantity)}</span>
										</div>
									))}
								</div>
							))}
							<dl>
								<div>
									<dt>Items</dt>
									<dd>${formatterStr(totals.subtotal)}</dd>
								</div>
								<div>
									<dt>Delivery{groups.length > 1 ? ` (${groups.length} florists)` : ''}</dt>
									<dd>{totals.delivery ? `$${formatterStr(totals.delivery)}` : 'Free'}</dd>
								</div>
								<div className={'total'}>
									<dt>Total</dt>
									<dd>${formatterStr(totals.total)}</dd>
								</div>
							</dl>
							{serverError && (
								<p className={'shop-error'} role={'alert'}>
									{serverError} <Link href={'/cart'}>Edit the cart</Link>
								</p>
							)}
							<button type={'submit'} className={'shop-btn'} disabled={placing}>
								{placing ? 'Placing your order…' : 'Place order'}
							</button>
							<p className={'shop-pay'}>Cash on delivery. You pay when the order arrives.</p>
						</section>
					</aside>
				</form>
			</div>
		</div>
	);
};

export default withLayoutBasic(Checkout);
