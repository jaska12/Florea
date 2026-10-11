import { Member } from '../member/member';

export interface ChatMessage {
	event: string;
	text: string;
	// null for a visitor who is not logged in
	memberData: Member | null;
}
