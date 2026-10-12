import React from 'react';
import Link from 'next/link';
import Moment from 'react-moment';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	// an article without a picture gets a quiet tinted block, not a stock photo
	const articleImage = article?.articleImage ? `${process.env.REACT_APP_API_URL}/${article?.articleImage}` : null;
	const articleHref = `/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;

	// vertical: a photo card in the news grid; otherwise a compact row in the side list
	if (vertical) {
		return (
			<Link className={'community-card'} href={articleHref}>
				<span
					className={articleImage ? 'community-photo' : 'community-photo no-photo'}
					style={articleImage ? { backgroundImage: `url(${articleImage})` } : undefined}
				>
					{!articleImage && <LocalFloristOutlinedIcon aria-hidden={true} />}
					<span className={'community-rank'}>{index + 1}</span>
				</span>
				<strong className={'community-title'}>{article?.articleTitle}</strong>
				<span className={'community-date'}>
					<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
				</span>
			</Link>
		);
	} else {
		return (
			<Link className={'community-row'} href={articleHref}>
				{articleImage ? (
					<img src={articleImage} alt="" />
				) : (
					<span className={'community-thumb no-photo'}>
						<LocalFloristOutlinedIcon aria-hidden={true} />
					</span>
				)}
				<span className={'community-row-text'}>
					<strong className={'community-title'}>{article.articleTitle}</strong>
					<span className={'community-date'}>
						<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
					</span>
				</span>
			</Link>
		);
	}
};

export default CommunityCard;
