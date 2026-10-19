import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { chatMessagesVar, HelpHubTab, helpHubOpenVar, helpHubTabVar, userVar } from '../../../apollo/store';
import GiftAssistant from '../ai/GiftAssistant';
import LiveChat from '../Chat';

const MARK = '/img/logo/florea/florea-mark.svg';
const TABS: HelpHubTab[] = ['gift', 'chat'];

// One round button at the bottom right opens one panel with two tabs: the gift assistant and the live chat.
// Both tabs stay mounted while the panel is closed or the other tab is shown, so neither conversation is lost.
const HelpHub = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const open = useReactiveVar(helpHubOpenVar);
	const tab = useReactiveVar(helpHubTabVar);
	const user = useReactiveVar(userVar);
	const messages = useReactiveVar(chatMessagesVar);
	const loggedIn = Boolean(user?._id);
	const panelRef = useRef<HTMLElement>(null);
	const tabRefs = useRef<Record<HelpHubTab, HTMLButtonElement | null>>({ gift: null, chat: null });
	// how many chat messages had arrived when the chat was last on screen: the rest are unread
	const [seen, setSeen] = useState<number>(messages.length);
	const chatOnScreen = open && tab === 'chat';
	const unread = loggedIn && !chatOnScreen ? Math.max(0, messages.length - seen) : 0;

	/** LIFECYCLES **/
	useEffect(() => {
		if (chatOnScreen) setSeen(messages.length);
	}, [chatOnScreen, messages.length]);

	useEffect(() => {
		// opening a product from a recommendation leaves the panel; the conversations stay
		const close = () => helpHubOpenVar(false);
		router.events.on('routeChangeStart', close);
		return () => router.events.off('routeChangeStart', close);
	}, [router.events]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') helpHubOpenVar(false);
		};
		window.addEventListener('keydown', onKey);
		// on a phone the panel covers the page, which should not scroll behind it
		document.documentElement.classList.add('help-hub-open');
		return () => {
			window.removeEventListener('keydown', onKey);
			document.documentElement.classList.remove('help-hub-open');
		};
	}, [open]);

	useEffect(() => {
		// When the panel opens with a mouse, the text field of the tab is ready to type into; on a touch screen the
		// keyboard stays closed. Only on opening: a tab chosen with the arrow keys keeps the focus on the tab.
		if (!open || !window.matchMedia('(pointer: fine)').matches) return;
		const field = panelRef.current?.querySelector<HTMLElement>(`[data-hub-tab="${helpHubTabVar()}"] [data-hub-input]`);
		field?.focus({ preventScroll: true });
	}, [open]);

	/** HANDLERS **/
	const tabKeyHandler = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		// the arrow keys move between the tabs, as in any tab list
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		e.preventDefault();
		const next = TABS[(TABS.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
		helpHubTabVar(next);
		tabRefs.current[next]?.focus();
	};

	const label = (value: HelpHubTab) => (value === 'gift' ? t('hub.tab.gift') : t('hub.tab.chat'));

	return (
		<>
			<button
				type={'button'}
				className={`help-hub-button ${open ? 'open' : ''}`}
				onClick={() => helpHubOpenVar(!open)}
				aria-expanded={open}
				aria-controls={'help-hub'}
				aria-label={open ? t('hub.close') : unread ? t('hub.openWithUnread', { count: unread }) : t('hub.open')}
			>
				{open ? <CloseRoundedIcon /> : <img src={MARK} alt={''} />}
				{unread > 0 && (
					<span className={'help-hub-badge'} aria-hidden={true}>
						{unread > 9 ? '9+' : unread}
					</span>
				)}
			</button>

			<section
				id={'help-hub'}
				ref={panelRef}
				className={`help-hub ${open ? 'open' : ''}`}
				role={'dialog'}
				aria-label={t('hub.title')}
				aria-hidden={!open}
			>
				<header className={'hub-head'}>
					<img className={'hub-mark'} src={MARK} alt={''} />
					<strong>{t('hub.title')}</strong>
					<button type={'button'} className={'hub-close'} onClick={() => helpHubOpenVar(false)} aria-label={t('hub.close')}>
						<CloseRoundedIcon />
					</button>
				</header>

				<div className={'hub-tabs'} role={'tablist'} aria-label={t('hub.title')}>
					{TABS.map((value) => (
						<button
							type={'button'}
							key={value}
							ref={(el) => {
								tabRefs.current[value] = el;
							}}
							id={`help-hub-tab-${value}`}
							role={'tab'}
							aria-selected={tab === value}
							aria-controls={`help-hub-panel-${value}`}
							tabIndex={tab === value ? 0 : -1}
							className={tab === value ? 'on' : ''}
							onClick={() => helpHubTabVar(value)}
							onKeyDown={tabKeyHandler}
						>
							{label(value)}
							{value === 'chat' && unread > 0 && <span className={'hub-tab-dot'} aria-hidden={true} />}
						</button>
					))}
				</div>

				<div
					className={'hub-body'}
					id={'help-hub-panel-gift'}
					role={'tabpanel'}
					aria-labelledby={'help-hub-tab-gift'}
					data-hub-tab={'gift'}
					hidden={tab !== 'gift'}
				>
					<GiftAssistant active={open && tab === 'gift'} />
				</div>

				<div
					className={'hub-body'}
					id={'help-hub-panel-chat'}
					role={'tabpanel'}
					aria-labelledby={'help-hub-tab-chat'}
					data-hub-tab={'chat'}
					hidden={tab !== 'chat'}
				>
					{loggedIn ? (
						<LiveChat active={chatOnScreen} />
					) : (
						<div className={'hub-login'}>
							<p>{t('hub.logInToChat')}</p>
							<Link className={'hub-login-btn'} href={'/account/join'}>
								{t('hub.logInOrSignUp')}
							</Link>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default HelpHub;
