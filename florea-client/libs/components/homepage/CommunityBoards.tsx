import React from 'react';
import Link from 'next/link';
import CommunityCard from './CommunityCard';
import SectionHeader from './SectionHeader';
import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const searchCommunity = {
	page: 1,
	sort: 'articleViews',
	direction: 'DESC',
};

const CommunityBoards = () => {
	/** APOLLO REQUESTS **/
	const { data: getNewsArticlesData } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
	});

	const { data: getFreeArticlesData } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
	});

	const news: BoardArticle[] = getNewsArticlesData?.getBoardArticles?.list ?? [];
	const free: BoardArticle[] = getFreeArticlesData?.getBoardArticles?.list ?? [];

	// with no articles the homepage has nothing to show here, so the section is left out
	if (news.length === 0 && free.length === 0) return null;

	return (
		<section className={'home-section home-community'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={'From the community'}
					subtitle={'News and conversations from Florea members.'}
					seeAll={{ href: '/community', label: 'See all articles' }}
				/>
				<div className={news.length > 0 && free.length > 0 ? 'community-layout' : 'community-layout single'}>
					{news.length > 0 && (
						<div className={'community-column'}>
							<Link className={'community-column-title'} href={'/community?articleCategory=NEWS'}>
								News
							</Link>
							<div className={'community-grid'}>
								{news.map((article, index) => {
									return <CommunityCard vertical={true} article={article} index={index} key={article?._id} />;
								})}
							</div>
						</div>
					)}
					{free.length > 0 && (
						<div className={'community-column side'}>
							<Link className={'community-column-title'} href={'/community?articleCategory=FREE'}>
								Free board
							</Link>
							<div className={'community-list'}>
								{free.map((article, index) => {
									return <CommunityCard vertical={false} article={article} index={index} key={article?._id} />;
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default CommunityBoards;
