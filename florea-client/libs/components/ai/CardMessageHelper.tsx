import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { AI_CARD_MESSAGE } from '../../../apollo/user/mutation';
import { ProductOccasion } from '../../enums/product.enum';
import { AiCardTone, AiLanguage } from '../../enums/ai.enum';
import { AiCardMessageInput } from '../../types/ai/ai.input';
import { useEnumLabel } from '../../i18n/labels';
import AiNote from './AiNote';
import { aiErrorMessage } from './aiError';

interface CardMessageHelperProps {
	/** the occasion of what is being ordered, offered as the first choice **/
	occasion?: ProductOccasion;
	/** called with the suggestion the customer chose **/
	onPick: (message: string) => void;
}

const RECIPIENT_MIN = 2;
const RECIPIENT_MAX = 60;
/** the languages of the site (next-i18next locales) **/
const LANGUAGE_OF_LOCALE: Record<string, AiLanguage> = {
	en: AiLanguage.ENGLISH,
	kr: AiLanguage.KOREAN,
	ru: AiLanguage.RUSSIAN,
};

// "Write it for me" beside the gift card message: three suggestions, one click puts a suggestion into the field.
const CardMessageHelper = (props: CardMessageHelperProps) => {
	const { t } = useTranslation('ai');
	const enumLabel = useEnumLabel();
	const { onPick } = props;
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false);
	const [recipient, setRecipient] = useState<string>('');
	const [occasion, setOccasion] = useState<ProductOccasion>(props.occasion ?? ProductOccasion.BIRTHDAY);
	const [tone, setTone] = useState<AiCardTone>(AiCardTone.WARM);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [picked, setPicked] = useState<string>('');
	const [error, setError] = useState<string>('');
	const ready = recipient.trim().length >= RECIPIENT_MIN;

	/** APOLLO REQUESTS **/
	const [writeMessages, { loading }] = useMutation<{ aiCardMessage: { list: string[] } }, { input: AiCardMessageInput }>(
		AI_CARD_MESSAGE,
		{ context: { silentError: true } },
	);

	/** HANDLERS **/
	const suggestHandler = async () => {
		if (!ready || loading) return;
		setError('');
		try {
			const result = await writeMessages({
				variables: {
					input: {
						occasion,
						recipient: recipient.trim(),
						tone,
						language: LANGUAGE_OF_LOCALE[router.locale ?? 'en'] ?? AiLanguage.ENGLISH,
					},
				},
			});
			if (!result.data) throw new Error();
			setSuggestions(result.data.aiCardMessage.list);
			setPicked('');
		} catch (err: any) {
			setError(aiErrorMessage(err));
		}
	};

	const pickHandler = (message: string) => {
		setPicked(message);
		onPick(message);
	};

	return (
		<div className={'ai-helper'}>
			<button type={'button'} className={'ai-helper-toggle'} aria-expanded={open} onClick={() => setOpen(!open)}>
				<AutoAwesomeRoundedIcon />
				{t('cardHelper.writeItForMe')}
			</button>

			{open && (
				<div className={'ai-helper-body'}>
					<div className={'ai-helper-row'}>
						<label className={'ai-helper-field'}>
							<span>{t('cardHelper.whoIsItFor')}</span>
							<input
								type={'text'}
								maxLength={RECIPIENT_MAX}
								placeholder={t('cardHelper.myMotherAColleagueWho')}
								value={recipient}
								onChange={(e) => setRecipient(e.target.value)}
								onKeyDown={(e) => {
									// Enter here asks for suggestions; it must not send the order form
									if (e.key === 'Enter') {
										e.preventDefault();
										suggestHandler().then();
									}
								}}
							/>
						</label>
						<label className={'ai-helper-field'}>
							<span>{t('cardHelper.occasion')}</span>
							<select value={occasion} onChange={(e) => setOccasion(e.target.value as ProductOccasion)}>
								{Object.values(ProductOccasion).map((value) => (
									<option value={value} key={value}>
										{enumLabel('productOccasion', value)}
									</option>
								))}
							</select>
						</label>
					</div>

					<div className={'ai-helper-tones'} role={'group'} aria-label={t('cardHelper.tone')}>
						{Object.values(AiCardTone).map((value) => (
							<button
								type={'button'}
								className={tone === value ? 'on' : ''}
								aria-pressed={tone === value}
								onClick={() => setTone(value)}
								key={value}
							>
								{enumLabel('cardTone', value)}
							</button>
						))}
					</div>

					<button type={'button'} className={'ai-helper-go'} onClick={suggestHandler} disabled={!ready || loading}>
						{loading ? t('cardHelper.writing') : suggestions.length > 0 ? t('cardHelper.suggestThreeMore') : t('cardHelper.suggestThreeMessages')}
					</button>

					{error && (
						<p className={'ai-helper-error'} role={'alert'}>
							{error}
						</p>
					)}

					{suggestions.length > 0 && (
						<ul className={'ai-helper-list'} aria-label={t('cardHelper.suggestedMessages')}>
							{suggestions.map((message) => (
								<li key={message}>
									<button
										type={'button'}
										className={picked === message ? 'picked' : ''}
										aria-pressed={picked === message}
										onClick={() => pickHandler(message)}
									>
										{message}
									</button>
								</li>
							))}
						</ul>
					)}

					<AiNote>{t('cardHelper.chooseOneAndEditIt')}</AiNote>
				</div>
			)}
		</div>
	);
};

export default CardMessageHelper;
