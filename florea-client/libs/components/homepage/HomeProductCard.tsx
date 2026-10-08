import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface HomeProductCardProps {
	product: Product;
	/** when a section has no like action, the heart is shown as a plain count **/
	likeProductHandler?: any;
}

/** BIRTHDAY -> birthday, FLOWER_BOX -> flower box (capitalized in CSS) **/
const formatLabel = (value: string): string => (value ?? '').replace(/_/g, ' ').toLowerCase();

const HomeProductCard = (props: HomeProductCardProps) => {
	const { product, likeProductHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const liked = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);
	const isTop = Boolean(product && product?.productRank >= topProductRank);

	/** HANDLERS **/
	const pushDetailHandler = async (id: string) => {
		console.log('ID:', id);
		await router.push({
			pathname: '/product/detail',
			query: { id: id },
		});
	};

	return (
		<Stack className="home-product-card" key={product._id}>
			<Box component={'div'} className={'card-img'} onClick={() => pushDetailHandler(product._id)}>
				<div
					className={'card-photo'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})` }}
				/>
				{isTop && <span className={'card-badge'}>Top</span>}
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
						{likeProductHandler ? (
							<IconButton
								className={`like-btn ${liked ? 'liked' : ''}`}
								color={'default'}
								aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
								onClick={() => likeProductHandler(user, product?._id)}
							>
								{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							</IconButton>
						) : (
							<FavoriteBorderIcon className={'like-icon'} />
						)}
						<Typography className="view-cnt">{product?.productLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default HomeProductCard;
