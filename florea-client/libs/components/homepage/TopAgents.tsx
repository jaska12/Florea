import React, { useState } from 'react';
import Link from 'next/link';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import TopAgentCard from './TopAgentCard';
import SectionHeader from './SectionHeader';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getAgents?.list);
		},
	});

	/** HANDLERS **/

	if (!topAgents) return null;

	return (
		<section className={'home-section home-agents tinted'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Top agents'} subtitle={'The sellers behind the products, ranked by activity.'}>
					<Link className={'text-link'} href={'/agent'}>
						See all agents
					</Link>
					<button type={'button'} className={'nav-btn swiper-agents-prev'} aria-label={'Previous agents'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-agents-next'} aria-label={'Next agents'}>
						<EastIcon />
					</button>
				</SectionHeader>
				{topAgents.length === 0 ? (
					<div className={'empty-state'}>No agents yet.</div>
				) : (
					<Swiper
						className={'agent-swiper'}
						slidesPerView={'auto'}
						spaceBetween={24}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-agents-next',
							prevEl: '.swiper-agents-prev',
						}}
					>
						{topAgents.map((agent: Member) => {
							return (
								<SwiperSlide className={'agent-slide'} key={agent?._id}>
									<TopAgentCard agent={agent} key={agent?.memberNick} />
								</SwiperSlide>
							);
						})}
					</Swiper>
				)}
			</div>
		</section>
	);
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
