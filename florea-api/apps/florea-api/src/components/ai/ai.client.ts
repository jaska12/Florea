import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

/** used when AI_MODEL is not set **/
export const DEFAULT_AI_MODEL = 'gpt-6-luna';
const AI_TIMEOUT_MS = 15000;

/** why a question to the model gave no usable answer; the text is for the server log, never for the customer **/
export class AiFailure extends Error {}

export interface AiJsonRequest {
	/** a short name for the answer's format: letters, digits and underscores **/
	name: string;
	/** who the model is and what it must return **/
	system: string;
	/** the question, with the customer's words and the shop's data **/
	user: string;
	/** JSON schema of the answer; every property required and no extra ones, as strict mode needs **/
	schema: Record<string, unknown>;
	maxTokens: number;
}

/**
 * The one place that talks to the OpenAI API. The key stays on the server: it is read from
 * OPENAI_API_KEY here and goes nowhere else.
 */
@Injectable()
export class AiClient {
	private client: OpenAI | null = null;

	public isConfigured(): boolean {
		return Boolean(process.env.OPENAI_API_KEY);
	}

	/** asks one question and returns the parsed JSON answer; throws AiFailure for anything else **/
	public async askJson(request: AiJsonRequest): Promise<unknown> {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) throw new AiFailure('OPENAI_API_KEY is not set');
		this.client ??= new OpenAI({ apiKey, timeout: AI_TIMEOUT_MS, maxRetries: 1 });

		let response: OpenAI.Responses.Response;
		try {
			response = await this.client.responses.create({
				model: process.env.AI_MODEL || DEFAULT_AI_MODEL,
				instructions: request.system,
				input: request.user,
				max_output_tokens: request.maxTokens,
				text: { format: { type: 'json_schema', name: request.name, schema: request.schema, strict: true } },
				// the customer's words are not kept on the provider's side after the answer
				store: false,
			});
		} catch (err) {
			throw new AiFailure(describeError(err));
		}

		// a cut-off answer or a refusal does not follow the schema
		if (response.status !== 'completed') {
			throw new AiFailure(
				`the answer ended as "${response.status}" (${response.incomplete_details?.reason ?? 'no reason given'})`,
			);
		}
		for (const item of response.output) {
			if (item.type === 'message' && item.content.some((part) => part.type === 'refusal')) {
				throw new AiFailure('the model refused');
			}
		}
		try {
			return JSON.parse(response.output_text);
		} catch {
			throw new AiFailure('the answer is not JSON');
		}
	}
}

const describeError = (err: unknown): string => {
	if (err instanceof OpenAI.APIConnectionTimeoutError) return 'the request timed out';
	if (err instanceof OpenAI.APIError) return `the API answered ${err.status ?? 'with an error'} (${err.name})`;
	return 'the request failed';
};
