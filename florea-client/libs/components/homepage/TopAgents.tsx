import { useTranslation } from 'next-i18next';
import React from 'react';
import TopAgentCard from './TopAgentCard';
import SectionHeader from './SectionHeader';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

// the section is one row of four florists; with fewer the row looks empty, so the section is left out
const AGENT_COUNT = 4;

const TopAgents = (props: TopAgentsProps) => {
	const { t } = useTranslation('home');
	const { initialInput } = props;

	/** APOLLO REQUESTS **/
	const { data: getAgentsData } = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
	});
	const topAgents: Member[] = getAgentsData?.getAgents?.list ?? [];

	if (topAgents.length < AGENT_COUNT) return null;

	return (
		<section className={'home-section home-agents tinted'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={t('florists.topFlorists')}
					subtitle={t('florists.theFloristsAndGiftShops')}
					seeAll={{ href: '/agent', label: t('florists.seeAllFlorists') }}
				/>
				<ul className={'agent-grid'}>
					{topAgents.slice(0, AGENT_COUNT).map((agent: Member) => {
						return (
							<li key={agent?._id}>
								<TopAgentCard agent={agent} />
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: AGENT_COUNT,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
