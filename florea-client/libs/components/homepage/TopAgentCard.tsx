import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Link from 'next/link';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}

/** "Rose Garden" -> "RG", "floreashop" -> "F" **/
const initialsOf = (name: string): string => {
	const words = name.trim().split(/[\s._-]+/).filter(Boolean);
	if (words.length === 0) return '';
	const letters = words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
	return letters.toUpperCase();
};

const TopAgentCard = (props: TopAgentProps) => {
	const { t } = useTranslation('home');
	const { agent } = props;
	const [photoFailed, setPhotoFailed] = useState<boolean>(false);
	const productCount = agent?.memberProducts ?? 0;
	const hasPhoto = Boolean(agent?.memberImage) && !photoFailed;
	const initials = initialsOf(agent?.memberFullName || agent?.memberNick || '');
	// one of four quiet tints, always the same one for the same florist
	const tint = (agent?.memberNick ?? '').split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 4;

	return (
		<Link
			className={'home-agent-card'}
			href={{
				pathname: '/agent/detail',
				query: { agentId: agent?._id },
			}}
		>
			<span className={'agent-photo'}>
				{hasPhoto ? (
					<img
						src={`${process.env.REACT_APP_API_URL}/${agent?.memberImage}`}
						alt=""
						onError={() => setPhotoFailed(true)}
					/>
				) : (
					<span className={`agent-initials tint-${tint}`} aria-hidden={true}>
						{initials}
					</span>
				)}
			</span>
			<strong className={'agent-name'}>{agent?.memberFullName || agent?.memberNick}</strong>
			<span className={'agent-meta'}>
				{t('florists.productsCount', { count: productCount })}
			</span>
		</Link>
	);
};

export default TopAgentCard;
