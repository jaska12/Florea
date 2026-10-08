import React, { useState } from 'react';
import Link from 'next/link';
import CommunityCard from './CommunityCard';
import SectionHeader from './SectionHeader';
import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBoardArticles?.list);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { articleCategory: BoardArticleCategory.FREE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBoardArticles?.list);
		},
	});

	const news = newsArticles ?? [];
	const free = freeArticles ?? [];
	const isEmpty = news.length === 0 && free.length === 0;

	return (
		<section className={'home-section home-community'}>
			<div className={'home-shell'}>
				<SectionHeader title={'From the community'} subtitle={'News and conversations from Florea members.'}>
					<Link className={'text-link'} href={'/community'}>
						Open the community
					</Link>
				</SectionHeader>
				{isEmpty ? (
					<div className={'empty-state'}>
						No articles yet. <Link href={'/community'}>Visit the community</Link> to read or write the first one.
					</div>
				) : (
					<div className={'community-layout'}>
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
					</div>
				)}
			</div>
		</section>
	);
};

export default CommunityBoards;
