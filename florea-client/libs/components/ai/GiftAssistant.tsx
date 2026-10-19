import { useTranslation } from 'next-i18next';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useReactiveVar } from '@apollo/client';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { giftAssistantTurnsVar, userVar } from '../../../apollo/store';
import { AI_GIFT_RECOMMEND } from '../../../apollo/user/mutation';
import { AiGiftRecommendation, GiftTurn } from '../../types/ai/ai';
import { AiGiftRecommendInput } from '../../types/ai/ai.input';
import AiNote from './AiNote';
import GiftPickCard from './GiftPickCard';
import { aiErrorMessage } from './aiError';

const PROMPT_MIN = 2;
const PROMPT_MAX = 300;
const MARK = '/img/logo/florea/florea-mark.svg';
/** requests to start from: the keys of their texts in ai.json **/
const EXAMPLES = ['assistant.example.mother', 'assistant.example.colleague', 'assistant.example.newHome'];

interface GiftAssistantProps {
	/** the tab is on screen: the newest message is brought into view **/
	active: boolean;
}

// The gift assistant, the first tab of the help panel (libs/components/help/HelpHub.tsx). A member describes
// who the gift is for, the occasion and the budget in their own words; the API reads the budget from the text
// and answers with products of the shop, each with a short reason.
const GiftAssistant = ({ active }: GiftAssistantProps) => {
	const { t } = useTranslation('ai');
	const user = useReactiveVar(userVar);
	const turns = useReactiveVar(giftAssistantTurnsVar);
	const [prompt, setPrompt] = useState<string>('');
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
		// the newest message is brought into view
		const thread = threadRef.current;
		if (active && thread) thread.scrollTo({ top: thread.scrollHeight });
	}, [active, turns]);

	/** HANDLERS **/
	const setTurn = (id: number, patch: Partial<GiftTurn>) => {
		giftAssistantTurnsVar(giftAssistantTurnsVar().map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
	};

	const askHandler = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!ready) return;
		const turn: GiftTurn = { id: Date.now(), prompt: prompt.trim(), status: 'loading' };
		// what was written before in this conversation goes along, so that a follow-up is understood
		const history = giftAssistantTurnsVar()
			.map((earlier) => earlier.prompt)
			.slice(-4);
		giftAssistantTurnsVar([...giftAssistantTurnsVar(), turn]);
		setPrompt('');

		try {
			const result = await recommend({
				variables: { input: { prompt: turn.prompt, ...(history.length > 0 ? { history } : {}) } },
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

	if (!loggedIn) {
		return (
			<div className={'hub-login'}>
				<p>{t('assistant.logInToUseThe')}</p>
				<Link className={'hub-login-btn'} href={'/account/join'}>
					{t('assistant.logInOrSignUp')}
				</Link>
			</div>
		);
	}

	const assistantSays = (content: React.ReactNode, extra = '', role?: 'status' | 'alert') => (
		<div className={`hub-row left ${extra}`} role={role}>
			<img className={'hub-avatar'} src={MARK} alt={''} />
			<div className={'hub-bubble assistant'}>{content}</div>
		</div>
	);

	return (
		<>
			<div className={'hub-thread'} ref={threadRef} aria-live={'polite'}>
				{assistantSays(<p>{t('assistant.welcome')}</p>)}
				{turns.length === 0 && (
					<ul className={'gift-examples'}>
						{EXAMPLES.map((example) => (
							<li key={example}>
								<button type={'button'} onClick={() => setPrompt(t(example))}>
									{t(example)}
								</button>
							</li>
						))}
					</ul>
				)}

				{turns.map((turn) => (
					<React.Fragment key={turn.id}>
						<div className={'hub-row right'}>
							<div className={'hub-bubble mine'}>{turn.prompt}</div>
						</div>

						{turn.status === 'loading' &&
							assistantSays(
								<span className={'hub-typing'} aria-label={t('assistant.lookingThroughTheShop')}>
									<i />
									<i />
									<i />
								</span>,
								'',
								'status',
							)}

						{turn.status === 'error' && assistantSays(<p>{turn.error}</p>, 'error', 'alert')}

						{turn.status === 'done' && turn.result && (
							<>
								{assistantSays(<p>{turn.result.message || t('assistant.ideas', { count: turn.result.list.length })}</p>)}
								{turn.result.list.length > 0 && (
									<ul className={'gift-picks'}>
										{turn.result.list.map((pick) => (
											<GiftPickCard key={pick.product._id} pick={pick} />
										))}
									</ul>
								)}
							</>
						)}
					</React.Fragment>
				))}
			</div>

			<form className={'hub-form'} onSubmit={askHandler}>
				<div className={'hub-input'}>
					<label className={'sr-only'} htmlFor={'gift-assistant-prompt'}>
						{t('assistant.describeTheGiftYouAre')}
					</label>
					<textarea
						id={'gift-assistant-prompt'}
						data-hub-input
						rows={1}
						maxLength={PROMPT_MAX}
						placeholder={t('assistant.placeholder')}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						onKeyDown={keyHandler}
					/>
					<button type={'submit'} className={`hub-send ${ready ? 'ready' : ''}`} disabled={!ready} aria-label={t('assistant.askTheAssistant')}>
						<ArrowUpwardRoundedIcon />
					</button>
				</div>
				<AiNote />
			</form>
		</>
	);
};

export default GiftAssistant;
