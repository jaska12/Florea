import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

/** used when AI_MODEL is not set **/
export const DEFAULT_AI_MODEL = 'claude-haiku-5-5';
const AI_TIMEOUT_MS = 15000;

/** why a question to the model gave no usable answer; the text is for the server log, never for the customer **/
export class AiFailure extends Error {}

export interface AiJsonRequest {
	/** who the model is and what it must return **/
	system: string;
	/** the question, with the customer's words and the shop's data **/
	user: string;
	/** JSON schema of the answer **/
	schema: Record<string, unknown>;
	maxTokens: number;
}

/**
 * The one place that talks to the Claude API. The key stays on the server: it is read from
 * ANTHROPIC_API_KEY here and goes nowhere else.
 */
@Injectable()
export class AiClient {
	private client: Anthropic | null = null;

	public isConfigured(): boolean {
		return Boolean(process.env.ANTHROPIC_API_KEY);
	}

	/** asks one question and returns the parsed JSON answer; throws AiFailure for anything else **/
	public async askJson(request: AiJsonRequest): Promise<unknown> {
		const apiKey = process.env.ANTHROPIC_API_KEY;
		if (!apiKey) throw new AiFailure('ANTHROPIC_API_KEY is not set');
		this.client ??= new Anthropic({ apiKey, timeout: AI_TIMEOUT_MS, maxRetries: 1 });

		let message: Anthropic.Message;
		try {
			message = await this.client.messages.create({
				model: process.env.AI_MODEL || DEFAULT_AI_MODEL,
				max_tokens: request.maxTokens,
				system: request.system,
				messages: [{ role: 'user', content: request.user }],
				output_config: { format: { type: 'json_schema', schema: request.schema } },
			});
		} catch (err) {
			throw new AiFailure(describeError(err));
		}

		// a refusal or a cut-off answer does not follow the schema
		if (message.stop_reason !== 'end_turn') throw new AiFailure(`the answer stopped with "${message.stop_reason}"`);
		const text = message.content
			.filter((block): block is Anthropic.TextBlock => block.type === 'text')
			.map((block) => block.text)
			.join('');
		try {
			return JSON.parse(text);
		} catch {
			throw new AiFailure('the answer is not JSON');
		}
	}
}

const describeError = (err: unknown): string => {
	if (err instanceof Anthropic.APIConnectionTimeoutError) return 'the request timed out';
	if (err instanceof Anthropic.APIError) return `the API answered ${err.status ?? 'with an error'} (${err.name})`;
	return 'the request failed';
};
