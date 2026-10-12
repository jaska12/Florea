/** the line to show when an AI request failed: the server's own message when it sent one **/
export const aiErrorMessage = (err: any): string => {
	const message: string | undefined = err?.graphQLErrors?.[0]?.message;
	if (message && !/^(Bad Request|Internal server error|Unauthorized)/i.test(message)) return message;
	if (err?.networkError) return 'The server could not be reached. Check your connection and try again.';
	return 'That did not work. Please try again in a moment.';
};
