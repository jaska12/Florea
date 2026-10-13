import { tr } from '../../i18n/tr';
import { serverText } from '../../i18n/serverText';

/** the line to show when an AI request failed: the server's own message when it sent one **/
export const aiErrorMessage = (err: any): string => {
	const message: string | undefined = err?.graphQLErrors?.[0]?.message;
	if (message && !/^(Bad Request|Internal server error|Unauthorized)/i.test(message)) return serverText(message);
	if (err?.networkError) return tr('ai:shared.unreachable', 'The server could not be reached. Check your connection and try again.');
	return tr('ai:shared.failed', 'That did not work. Please try again in a moment.');
};
