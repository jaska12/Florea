import React from 'react';
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

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

// with fewer florists than this the row looks empty, so the section is left out
const MIN_AGENTS = 4;

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;

	/** APOLLO REQUESTS **/
	const { data: getAgentsData } = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
	});
	const topAgents: Member[] = getAgentsData?.getAgents?.list ?? [];

	if (topAgents.length < MIN_AGENTS) return null;

	return (
		<section className={'home-section home-agents tinted'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={'Top florists'}
					subtitle={'The florists and gift shops behind the products.'}
					seeAll={{ href: '/agent', label: 'See all florists' }}
				>
					<button type={'button'} className={'nav-btn swiper-agents-prev'} aria-label={'Previous florists'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-agents-next'} aria-label={'Next florists'}>
						<EastIcon />
					</button>
				</SectionHeader>
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
