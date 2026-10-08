import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: any;
}

/** BIRTHDAY -> birthday, FLOWER_BOX -> flower box (capitalized in CSS) **/
const formatLabel = (value: string): string => (value ?? '').replace(/_/g, ' ').toLowerCase();

const TrendProductCard = (props: TrendProductCardProps) => {
	const { product, likeProductHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const liked = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);

	/** HANDLERS **/
	const pushDetailHandler = async (id: string) => {
		console.log('ID:', id);
		await router.push({
			pathname: '/product/detail',
			query: { id: id },
		});
	};

	// the same card is used on desktop and mobile; only the stylesheet differs
	return (
		<Stack className="trend-card-box" key={product._id}>
			<Box component={'div'} className={'card-img'} onClick={() => pushDetailHandler(product._id)}>
				<div
					className={'card-photo'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})` }}
				/>
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
					{product.productTitle}
				</strong>
				<div className={'tags'}>
					<span className={'tag'}>{formatLabel(product.productOccasion)}</span>
					<span className={'tag'}>{formatLabel(product.productSize)}</span>
				</div>
				<div className={'bott'}>
					<p className={'price'}>${formatterStr(product.productPrice)}</p>
					<div className="view-like-box">
						<VisibilityOutlinedIcon className={'view-icon'} />
						<Typography className="view-cnt">{product?.productViews}</Typography>
						<IconButton
							className={`like-btn ${liked ? 'liked' : ''}`}
							color={'default'}
							aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
							onClick={() => likeProductHandler(user, product?._id)}
						>
							{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<Typography className="view-cnt">{product?.productLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default TrendProductCard;
