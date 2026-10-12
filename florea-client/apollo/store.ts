import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
import { ChatMessage } from '../libs/types/chat/chat';
import { CartItem } from '../libs/types/cart/cart';
export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberProducts: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});

export const groupVar = makeVar<string>('MIT-A4');

export const socketVar = makeVar<any>(null);

/** filled by libs/socket.ts **/
export const chatMessagesVar = makeVar<ChatMessage[]>([]);
export const chatOnlineVar = makeVar<number>(0);
export const chatOpenVar = makeVar<boolean>(false);
// goes up by one each time the server says the member has a new or removed notification
export const notificationPingVar = makeVar<number>(0);

/** filled by libs/cart.ts **/
export const cartVar = makeVar<CartItem[]>([]);
