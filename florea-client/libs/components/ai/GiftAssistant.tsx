import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useReactiveVar } from '@apollo/client';
import Drawer from '@mui/material/Drawer';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { giftAssistantOpenVar, giftAssistantTurnsVar, userVar } from '../../../apollo/store';
import { AI_GIFT_RECOMMEND } from '../../../apollo/user/mutation';
import { ProductOccasion } from '../../enums/product.enum';
import { AiGiftRecommendation, GiftTurn } from '../../types/ai/ai';
import { AiGiftRecommendInput } from '../../types/ai/ai.input';
import ProductCardView, { prettyLabel } from '../common/ProductCardView';
import AddToCartButton from '../common/AddToCartButton';
import AiNote from './AiNote';
import { aiErrorMessage } from './aiError';

const PROMPT_MIN = 2;
const PROMPT_MAX = 300;
const EXAMPLES = [
	'A birthday gift for my mother who loves tulips',
	'Something small to say thank you to a colleague',
	'A plant for a friend who just moved house',
];

// The gift assistant: a floating button that opens a panel where a member describes who the gift is for
// and gets products of the shop back, each with the assistant's reason.
const GiftAssistant = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const open = useReactiveVar(giftAssistantOpenVar);
	const turns = useReactiveVar(giftAssistantTurnsVar);
	const [prompt, setPrompt] = useState<string>('');
	const [budget, setBudget] = useState<string>('');
	const [occasion, setOccasion] = useState<string>('');
	const threadRef = useRef<HTMLDivElement>(null);
	const loggedIn = Boolean(user?._id);
	const busy = turns.some((turn) => turn.status === 'loading');
	const ready = prompt.trim().length >= PROMPT_MIN && !busy;

	/** APOLLO REQUESTS **/
	// a failure is shown in the panel, so the global error alert stays closed
	const [recommend] = useMutation<{ aiGiftRecommend: AiGiftRecommendation }, { input: AiGiftRecommendInput }>(
		AI_GIFT_RECOMMEND,
		{ context: { silentError: true } },
	);

	/** LIFECYCLES **/
	useEffect(() => {
		// opening a product leaves the panel; the conversation is still there when it is opened again
		const close = () => giftAssistantOpenVar(false);
		router.events.on('routeChangeStart', close);
		return () => router.events.off('routeChangeStart', close);
	}, [router.events]);

	useEffect(() => {
		// the newest request is brought into view
		const thread = threadRef.current;
		if (open && thread) thread.scrollTo({ top: thread.scrollHeight });
	}, [open, turns]);

	/** HANDLERS **/
	const setTurn = (id: number, patch: Partial<GiftTurn>) => {
		giftAssistantTurnsVar(giftAssistantTurnsVar().map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
	};

	const askHandler = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!ready) return;
		const budgetMax = Number(budget) > 0 ? Number(budget) : undefined;
		const turn: GiftTurn = {
			id: Date.now(),
			prompt: prompt.trim(),
			budgetMax,
			occasion: (occasion || undefined) as ProductOccasion | undefined,
			status: 'loading',
		};
		// what was written before in this conversation goes along, so that a follow-up is understood
		const history = giftAssistantTurnsVar()
			.map((earlier) => earlier.prompt)
			.slice(-4);
		giftAssistantTurnsVar([...giftAssistantTurnsVar(), turn]);
		setPrompt('');

		try {
			const result = await recommend({
				variables: {
					input: {
						prompt: turn.prompt,
						budgetMax: turn.budgetMax,
						occasion: turn.occasion,
						...(history.length > 0 ? { history } : {}),
					},
				},
			});
			if (!result.data) throw new Error();
			setTurn(turn.id, { status: 'done', result: result.data.aiGiftRecommend });
		} catch (err: any) {
			setTurn(turn.id, { status: 'error', error: aiErrorMessage(err) });
		}
	};

	const keyHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Enter sends, Shift+Enter starts a new line
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			askHandler().then();
		}
	};

	const openProductHandler = async (id: string) => {
		await router.push({ pathname: '/product/detail', query: { id } });
	};

	return (
		<>
			<button
				type={'button'}
				className={loggedIn ? 'gift-assistant-button above-chat' : 'gift-assistant-button'}
				onClick={() => giftAssistantOpenVar(true)}
				aria-haspopup={'dialog'}
			>
				<AutoAwesomeRoundedIcon />
				<span>Find a gift</span>
			</button>

			<Drawer
				anchor={'right'}
				open={open}
				onClose={() => giftAssistantOpenVar(false)}
				PaperProps={{ className: 'gift-assistant', 'aria-label': 'Gift assistant' } as object}
			>
				<header className={'ga-head'}>
					<span className={'ga-mark'}>
						<AutoAwesomeRoundedIcon />
					</span>
					<div className={'ga-heading'}>
						<strong>Gift assistant</strong>
						<span>Tell me who it is for, and I will look through the shop.</span>
					</div>
					<button type={'button'} className={'ga-close'} onClick={() => giftAssistantOpenVar(false)} aria-label={'Close'}>
						<CloseRoundedIcon />
					</button>
				</header>

				{!loggedIn ? (
					<div className={'ga-login'}>
						<p>Log in to use the gift assistant. It looks through the products of Florea florists and suggests a few that fit.</p>
						<Link className={'ga-login-btn'} href={'/account/join'}>
							Log in or sign up
						</Link>
					</div>
				) : (
					<>
						<div className={'ga-thread'} ref={threadRef} aria-live={'polite'}>
							{turns.length === 0 && (
								<div className={'ga-welcome'}>
									<p>Hello! Who is the gift for, and what is the occasion? A budget helps too.</p>
									<ul>
										{EXAMPLES.map((example) => (
											<li key={example}>
												<button type={'button'} onClick={() => setPrompt(example)}>
													{example}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}

							{turns.map((turn) => (
								<div className={'ga-turn'} key={turn.id}>
									<div className={'ga-ask'}>
										<p>{turn.prompt}</p>
										{(turn.budgetMax || turn.occasion) && (
											<span className={'ga-ask-meta'}>
												{[turn.occasion && prettyLabel(turn.occasion), turn.budgetMax && `up to $${turn.budgetMax}`]
													.filter(Boolean)
													.join(' · ')}
											</span>
										)}
									</div>

									{turn.status === 'loading' && (
										<div className={'ga-answer loading'} role={'status'}>
											<span className={'ga-dots'} aria-hidden={true}>
												<i />
												<i />
												<i />
											</span>
											Looking through the shop…
										</div>
									)}

									{turn.status === 'error' && (
										<div className={'ga-answer error'} role={'alert'}>
											{turn.error}
										</div>
									)}

									{turn.status === 'done' && turn.result && (
										<div className={'ga-answer'}>
											{turn.result.message ? (
												<p className={'ga-line'}>{turn.result.message}</p>
											) : (
												<p className={'ga-line'}>
													{turn.result.list.length === 1 ? 'Here is one idea:' : `Here are ${turn.result.list.length} ideas:`}
												</p>
											)}
											<ul className={'ga-picks'}>
												{turn.result.list.map((pick) => (
													<li key={pick.product._id}>
														<ProductCardView
															className="ga-card"
															product={pick.product}
															liked={false}
															onOpen={() => openProductHandler(pick.product._id)}
														/>
														{pick.reason && (
															<p className={'ga-reason'}>
																<AutoAwesomeRoundedIcon />
																{pick.reason}
															</p>
														)}
														<AddToCartButton product={pick.product} variant={'full'} />
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							))}
						</div>

						<form className={'ga-form'} onSubmit={askHandler}>
							<div className={'ga-filters'}>
								<label>
									<span className={'sr-only'}>Occasion</span>
									<select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
										<option value={''}>Any occasion</option>
										{Object.values(ProductOccasion).map((value) => (
											<option value={value} key={value}>
												{prettyLabel(value)}
											</option>
										))}
									</select>
								</label>
								<label className={'ga-budget'}>
									<span className={'sr-only'}>Budget in dollars</span>
									<i aria-hidden={true}>$</i>
									<input
										type={'number'}
										inputMode={'numeric'}
										min={1}
										placeholder={'Budget'}
										value={budget}
										onChange={(e) => setBudget(e.target.value)}
									/>
								</label>
							</div>
							<div className={'ga-input'}>
								<label className={'sr-only'} htmlFor={'gift-assistant-prompt'}>
									Describe the gift you are looking for
								</label>
								<textarea
									id={'gift-assistant-prompt'}
									rows={2}
									maxLength={PROMPT_MAX}
									placeholder={'Describe who the gift is for…'}
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									onKeyDown={keyHandler}
								/>
								<button type={'submit'} disabled={!ready} aria-label={'Ask the assistant'}>
									<ArrowUpwardRoundedIcon />
								</button>
							</div>
							<AiNote />
						</form>
					</>
				)}
			</Drawer>
		</>
	);
};

export default GiftAssistant;
