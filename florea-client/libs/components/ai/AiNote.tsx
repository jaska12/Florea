import { useTranslation } from 'next-i18next';
import React from 'react';

interface AiNoteProps {
	/** what follows the standard sentence, when the place needs to say more **/
	children?: React.ReactNode;
}

// The small line shown wherever the site offers text or picks made by AI.
const AiNote = (props: AiNoteProps) => {
	const { t } = useTranslation('ai');
	return (
		<small className={'ai-note'}>
			{t('shared.note')}
			{props.children ? <> {props.children}</> : null}
		</small>
	);
};

export default AiNote;
