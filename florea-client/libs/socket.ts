import { chatMessagesVar, chatOnlineVar, notificationPingVar, socketVar } from '../apollo/store';
import { getJwtToken } from './auth';
import { ChatMessage } from './types/chat/chat';

// The one WebSocket of the page: live chat and the "you have a new notification" signal.
// What arrives is kept in reactive variables, so it survives the page changes that remount the chat window.

const MAX_MESSAGES = 100;
const RETRY_MIN = 2000;
const RETRY_MAX = 30000;

let socketUrl = '';
let socketToken = ''; // the token the open socket was opened with
let retryDelay = RETRY_MIN;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

const messageHandler = (raw: string) => {
	let data: any;
	try {
		data = JSON.parse(raw);
	} catch (err) {
		return;
	}

	switch (data?.event) {
		case 'info':
			chatOnlineVar(data.totalClients ?? 0);
			break;
		case 'getMessages':
			chatMessagesVar(data.list ?? []);
			break;
		case 'message':
			chatMessagesVar([...chatMessagesVar(), data as ChatMessage].slice(-MAX_MESSAGES));
			break;
		case 'notification':
			notificationPingVar(notificationPingVar() + 1);
			break;
		default:
			break;
	}
};

export const openSocket = (url: string): WebSocket => {
	socketUrl = url;
	socketToken = getJwtToken() || '';
	if (retryTimer) clearTimeout(retryTimer);

	const socket = new WebSocket(`${url}?token=${socketToken}`);
	socketVar(socket);

	socket.onopen = () => {
		console.log('WebSocket connection!');
		retryDelay = RETRY_MIN;
	};

	socket.onmessage = (msg) => messageHandler(msg.data);

	socket.onerror = (error) => {
		console.log('WebSocket, error:', error);
	};

	// A socket that drops (server restart, network) is opened again, a little later each time.
	socket.onclose = () => {
		if (socketVar() !== socket) return; // replaced on purpose
		chatOnlineVar(0);
		retryTimer = setTimeout(() => openSocket(socketUrl), retryDelay);
		retryDelay = Math.min(retryDelay * 2, RETRY_MAX);
	};

	return socket;
};

// After a login without a page reload the open socket still belongs to a guest: open it again as the member.
export const refreshSocket = () => {
	if (!socketUrl || (getJwtToken() || '') === socketToken) return;

	const old: WebSocket | null = socketVar();
	openSocket(socketUrl);
	old?.close();
};

export const sendChatMessage = (text: string): boolean => {
	const socket: WebSocket | null = socketVar();
	if (!socket || socket.readyState !== WebSocket.OPEN) return false;

	socket.send(JSON.stringify({ event: 'message', data: text }));
	return true;
};
