import React from 'react';
import Link from 'next/link';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}

const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const productCount = agent?.memberProducts ?? 0;

	return (
		<Link
			className={'home-agent-card'}
			href={{
				pathname: '/agent/detail',
				query: { agentId: agent?._id },
			}}
		>
			<span className={'agent-photo'}>
				<img src={agentImage} alt="" />
			</span>
			<strong className={'agent-name'}>{agent?.memberNick}</strong>
			<span className={'agent-meta'}>
				{productCount} {productCount === 1 ? 'product' : 'products'}
			</span>
		</Link>
	);
};

export default TopAgentCard;
