import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import ScrollableFeed from 'react-scrollable-feed';
import { chatMessagesVar, chatOnlineVar, chatOpenVar, socketVar, userVar } from '../../apollo/store';
import { sendChatMessage } from '../socket';
import { ChatMessage } from '../types/chat/chat';
import { REACT_APP_API_URL } from '../config';

const MAX_LENGTH = 300;

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const messagesList: ChatMessage[] = useReactiveVar(chatMessagesVar);
	const onlineUsers: number = useReactiveVar(chatOnlineVar);
	const open: boolean = useReactiveVar(chatOpenVar);
	const [message, setMessage] = useState<string>('');
	const [openButton, setOpenButton] = useState(false);
	// how many messages had arrived when the window was last open: anything after that is unread
	const [seenCount, setSeenCount] = useState<number>(messagesList.length);
	const router = useRouter();
	const connected = Boolean(socket) && onlineUsers > 0;
	const unread = !open && messagesList.length > seenCount;

	/** LIFECYCLES **/
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	useEffect(() => {
		if (open) setSeenCount(messagesList.length);
	}, [open, messagesList.length]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		chatOpenVar(!open);
	};

	const getInputMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	};

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key == 'Enter') onClickHandler();
	};

	const onClickHandler = () => {
		const text = message.trim();
		if (!text) return;
		if (sendChatMessage(text)) setMessage('');
	};

	const imageOf = (ele: ChatMessage): string => {
		const image = ele.memberData?.memberImage;
		return image && !image.startsWith('/img/') ? `${REACT_APP_API_URL}/${image}` : '/img/profile/defaultUser.svg';
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button
					className={`chat-button ${unread ? 'unread' : ''}`}
					onClick={handleOpenChat}
					aria-label={open ? t('chat.close') : t('chat.title')}
					aria-expanded={open}
				>
					{open ? <CloseFullscreenIcon /> : <ChatBubbleOutlineRoundedIcon />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`} aria-hidden={!open}>
				<Box className={'chat-top'} component={'div'}>
					<strong>{t('chat.title')}</strong>
					<span className={`chat-online ${connected ? '' : 'offline'}`}>
						{connected ? t('chat.online', { count: onlineUsers }) : t('chat.connecting')}
					</span>
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<div className={'chat-note'}>{t('chat.welcome')}</div>
							{messagesList.map((ele: ChatMessage, index: number) => {
								const mine = Boolean(ele.memberData?._id) && ele.memberData?._id === user?._id;
								return mine ? (
									<Box className={'msg-row right'} component={'div'} key={index}>
										<div className={'msg-right'}>{ele.text}</div>
									</Box>
								) : (
									<Box className={'msg-row left'} component={'div'} key={index}>
										<Avatar alt={ele.memberData?.memberNick ?? t('chat.guest')} src={imageOf(ele)} />
										<div className={'msg-body'}>
											<span className={'msg-name'}>{ele.memberData?.memberNick ?? t('chat.guest')}</span>
											<div className={'msg-left'}>{ele.text}</div>
										</div>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={t('chat.typeMessage')}
						value={message}
						maxLength={MAX_LENGTH}
						autoComplete={'off'}
						tabIndex={open ? 0 : -1}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button
						className={'send-msg-btn'}
						onClick={onClickHandler}
						disabled={!connected || !message.trim()}
						aria-label={t('chat.send')}
						tabIndex={open ? 0 : -1}
					>
						<SendIcon />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
