import React from 'react';

interface AiNoteProps {
	/** what follows the standard sentence, when the place needs to say more **/
	children?: React.ReactNode;
}

// The small line shown wherever the site offers text or picks made by AI.
const AiNote = (props: AiNoteProps) => {
	return (
		<small className={'ai-note'}>
			AI suggestions may not be perfect.{props.children ? <> {props.children}</> : null}
		</small>
	);
};

export default AiNote;
