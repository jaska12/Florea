import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import CommunityCard from '../common/CommunityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('member');
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>(initialInput);
	const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setMemberBoArticles(data?.getBoardArticles?.list);
			setTotal(data?.getBoardArticles?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) setSearchFilter({ ...initialInput, search: { memberId: memberId } });
	}, [memberId]);

	/** HANDLERS **/
	const likeArticleHandler = async (e: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert(t('articles.success'), 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	return (
		<div id="member-articles-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{t('articles.articles')}</Typography>
				</Stack>
			</Stack>
			<Stack className="articles-list-box">
				{memberBoArticles?.length === 0 && (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>{t('articles.noArticlesFound')}</p>
					</div>
				)}
				{memberBoArticles?.map((boardArticle: BoardArticle) => {
					return (
						<CommunityCard
							boardArticle={boardArticle}
							key={boardArticle?._id}
							size={'small'}
							likeArticleHandler={likeArticleHandler}
						/>
					);
				})}
			</Stack>
			{memberBoArticles?.length !== 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchFilter.limit) || 1}
							page={searchFilter.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>{total} product available</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberArticles;
