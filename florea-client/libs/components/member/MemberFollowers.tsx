import { useTranslation } from 'next-i18next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useReactiveVar } from '@apollo/client';
import { Follower } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface MemberFollowsProps {
	initialInput?: FollowInquiry;
	subscribeHandler?: any;
	unsubscribeHandler?: any;
	likeMemberHandler?: any;
	redirectToMemberPageHandler?: any;
}

const MemberFollowers = (props: MemberFollowsProps) => {
	const { t } = useTranslation('member');
	const { initialInput, subscribeHandler, unsubscribeHandler, likeMemberHandler, redirectToMemberPageHandler } = props;
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const category: any = router.query?.category ?? 'products';
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(
		initialInput || { page: 1, limit: 5, search: { followingId: '' } },
	);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.memberId)
			setFollowInquiry({ ...followInquiry, search: { followingId: router.query.memberId as string } });
		else setFollowInquiry({ ...followInquiry, search: { followingId: user?._id } });
	}, [router]);

	useEffect(() => { }, [followInquiry]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		followInquiry.page = value;
		setFollowInquiry({ ...followInquiry });
	};

	return (
		<div id="member-follows-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{category === 'followers' ? t('follows.followers') : t('follows.followings')}</Typography>
				</Stack>
			</Stack>
			<Stack className="follows-list-box">
				<Stack className="listing-title-box">
					<Typography className="title-text">{t('follows.name')}</Typography>
					<Typography className="title-text">{t('follows.details')}</Typography>
					<Typography className="title-text">{t('follows.subscription')}</Typography>
				</Stack>
				{memberFollowers?.length === 0 && (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>{t('follows.noFollowersYet')}</p>
					</div>
				)}
				{memberFollowers.map((follower: Follower) => {
					const imagePath: string = follower?.followerData?.memberImage
						? `${REACT_APP_API_URL}/${follower?.followerData?.memberImage}`
						: '/img/profile/defaultUser.svg';
					return (
						<Stack className="follows-card-box" key={follower._id}>
							<Stack className={'info'} onClick={() => redirectToMemberPageHandler(follower?.followerData?._id)}>
								<Stack className="image-box">
									<img src={imagePath} alt="" />
								</Stack>
								<Stack className="information-box">
									<Typography className="name">{follower?.followerData?.memberNick}</Typography>
								</Stack>
							</Stack>
							<Stack className={'details-box'}>
								<Box className={'info-box'} component={'div'}>
									<p>{t('follows.followers')}</p>
									<span>({follower?.followerData?.memberFollowers})</span>
								</Box>
								<Box className={'info-box'} component={'div'}>
									<p>{t('follows.followings')}</p>
									<span>({follower?.followerData?.memberFollowings})</span>
								</Box>
								<Box className={'info-box'} component={'div'}>
									{follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
									<span>({follower?.followerData?.memberLikes})</span>
								</Box>
							</Stack>
							{user?._id !== follower?.followerId && (
								<Stack className="action-box">
									{follower.meFollowed && follower.meFollowed[0]?.myFollowing ? (
										<>
											<Typography>{t('follows.following')}</Typography>
											<Button
												variant="outlined"
												sx={{ background: '#ed5858', ':hover': { background: '#ee7171' } }}
												onClick={() => unsubscribeHandler(follower?.followerData?._id, null, followInquiry)}
											>
												{t('follows.unfollow')}
											</Button>
										</>
									) : (
										<Button
											variant="contained"
											sx={{ background: '#60eb60d4', ':hover': { background: '#60eb60d4' } }}
											onClick={() => subscribeHandler(follower?.followerData?._id, null, followInquiry)}
										>
											{t('follows.follow')}
										</Button>
									)}
								</Stack>
							)}
						</Stack>
					);
				})}
			</Stack>
			{memberFollowers.length !== 0 && (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							page={followInquiry.page}
							count={Math.ceil(total / followInquiry.limit)}
							onChange={paginationHandler}
							shape="circular"
							color="primary"
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>{t('follows.followersTotal', { count: total })}</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MemberFollowers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {
			followingId: '',
		},
	},
};

export default MemberFollowers;
