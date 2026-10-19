import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { chatMessagesVar, chatOnlineVar, socketVar, userVar } from '../../apollo/store';
import { sendChatMessage } from '../socket';
import { ChatMessage } from '../types/chat/chat';
import { REACT_APP_API_URL } from '../config';

const MAX_LENGTH = 300;

interface LiveChatProps {
	/** the tab is on screen: the newest message is brought into view **/
	active: boolean;
}

// The live chat, the second tab of the help panel (libs/components/help/HelpHub.tsx): one public room for the
// members who are logged in. The messages come and go through libs/socket.ts; they are not stored.
const LiveChat = ({ active }: LiveChatProps) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const messagesList: ChatMessage[] = useReactiveVar(chatMessagesVar);
	const onlineUsers: number = useReactiveVar(chatOnlineVar);
	const [message, setMessage] = useState<string>('');
	const threadRef = useRef<HTMLDivElement>(null);
	const connected = Boolean(socket) && onlineUsers > 0;
	const ready = connected && Boolean(message.trim());

	/** LIFECYCLES **/
	useEffect(() => {
		const thread = threadRef.current;
		if (active && thread) thread.scrollTo({ top: thread.scrollHeight });
	}, [active, messagesList.length]);

	/** HANDLERS **/
	const sendHandler = (e?: React.FormEvent) => {
		e?.preventDefault();
		const text = message.trim();
		if (!text || !connected) return;
		if (sendChatMessage(text)) setMessage('');
	};

	const keyHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Enter sends, Shift+Enter starts a new line
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendHandler();
		}
	};

	const imageOf = (ele: ChatMessage): string => {
		const image = ele.memberData?.memberImage;
		return image && !image.startsWith('/img/') ? `${REACT_APP_API_URL}/${image}` : '/img/profile/defaultUser.svg';
	};

	return (
		<>
			<div className={'chat-status'}>
				<span className={`chat-online ${connected ? '' : 'offline'}`}>
					{connected ? t('chat.online', { count: onlineUsers }) : t('chat.connecting')}
				</span>
				<span className={'chat-public'}>{t('chat.publicNote')}</span>
			</div>

			<div className={'hub-thread'} ref={threadRef} aria-live={'polite'}>
				<p className={'chat-note'}>{t('chat.welcome')}</p>
				{messagesList.map((ele: ChatMessage, index: number) => {
					const mine = Boolean(ele.memberData?._id) && ele.memberData?._id === user?._id;
					return mine ? (
						<div className={'hub-row right'} key={index}>
							<div className={'hub-bubble mine'}>{ele.text}</div>
						</div>
					) : (
						<div className={'hub-row left'} key={index}>
							<Avatar className={'hub-avatar'} alt={ele.memberData?.memberNick ?? t('chat.guest')} src={imageOf(ele)} />
							<div className={'hub-message'}>
								<span className={'hub-name'}>{ele.memberData?.memberNick ?? t('chat.guest')}</span>
								<div className={'hub-bubble other'}>{ele.text}</div>
							</div>
						</div>
					);
				})}
			</div>

			<form className={'hub-form'} onSubmit={sendHandler}>
				<div className={'hub-input'}>
					<label className={'sr-only'} htmlFor={'live-chat-message'}>
						{t('chat.typeMessage')}
					</label>
					<textarea
						id={'live-chat-message'}
						data-hub-input
						rows={1}
						placeholder={t('chat.typeMessage')}
						value={message}
						maxLength={MAX_LENGTH}
						autoComplete={'off'}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={keyHandler}
					/>
					<button type={'submit'} className={`hub-send ${ready ? 'ready' : ''}`} disabled={!ready} aria-label={t('chat.send')}>
						<SendRoundedIcon />
					</button>
				</div>
			</form>
		</>
	);
};

export default LiveChat;
