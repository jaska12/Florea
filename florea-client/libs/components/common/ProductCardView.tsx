import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { formatterStr } from '../../utils';

interface ProductCardViewProps {
	product: Product;
	/** layout class of the place that shows the card (it sets the width) **/
	className: string;
	liked: boolean;
	onOpen: () => void;
	/** without it the heart is a plain count **/
	onLike?: (e: any) => void;
	/** recently-visited lists hide the counters **/
	showStats?: boolean;
	/** when true a click anywhere on the card opens the product **/
	wholeCardOpens?: boolean;
}

/** BIRTHDAY -> birthday, FLOWER_BOX -> flower box (capitalized in CSS) **/
export const formatLabel = (value: string): string => (value ?? '').replace(/_/g, ' ').toLowerCase();

/** BIRTHDAY -> Birthday, FLOWER_BOX -> Flower Box **/
export const prettyLabel = (value: string): string => formatLabel(value).replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

/**
 * The one product card of the site: photo, title, occasion and size, price, views and likes.
 * It only draws; the component that uses it keeps its own data and like logic.
 */
const ProductCardView = (props: ProductCardViewProps) => {
	const { product, className, liked, onOpen, onLike, showStats = true, wholeCardOpens = false } = props;
	const isTop = Boolean(product && product?.productRank >= topProductRank);
	const photo = product?.productImages?.[0];

	return (
		<Stack className={`${className} florea-card`} onClick={wholeCardOpens ? onOpen : undefined}>
			<Box component={'div'} className={'card-img'} onClick={wholeCardOpens ? undefined : onOpen}>
				{photo && <div className={'card-photo'} style={{ backgroundImage: `url(${REACT_APP_API_URL}/${photo})` }} />}
				{isTop && <span className={'card-badge'}>Top</span>}
				{(product?.productSameDay || product?.productGiftWrap) && (
					<span className={'card-flags'}>
						{product?.productSameDay && <span className={'flag'}>Same day</span>}
						{product?.productGiftWrap && <span className={'flag'}>Gift wrap</span>}
					</span>
				)}
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'} onClick={wholeCardOpens ? undefined : onOpen}>
					{product?.productTitle}
				</strong>
				<div className={'tags'}>
					<span className={'tag'}>{formatLabel(product?.productOccasion)}</span>
					<span className={'tag'}>{formatLabel(product?.productSize)}</span>
				</div>
				<div className={'bott'}>
					<p className={'price'}>${formatterStr(product?.productPrice)}</p>
					{showStats && (
						<div className="view-like-box">
							<VisibilityOutlinedIcon className={'view-icon'} />
							<Typography className="view-cnt">{product?.productViews}</Typography>
							{onLike ? (
								<IconButton
									className={`like-btn ${liked ? 'liked' : ''}`}
									color={'default'}
									aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
									onClick={onLike}
								>
									{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</IconButton>
							) : (
								<FavoriteBorderIcon className={'like-icon'} />
							)}
							<Typography className="view-cnt">{product?.productLikes}</Typography>
						</div>
					)}
				</div>
			</Box>
		</Stack>
	);
};

export default ProductCardView;
