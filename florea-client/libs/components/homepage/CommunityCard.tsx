import React from 'react';
import Link from 'next/link';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';
	const articleHref = `/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;

	// vertical: a photo card in the news grid; otherwise a compact row in the side list
	if (vertical) {
		return (
			<Link className={'community-card'} href={articleHref}>
				<span className={'community-photo'} style={{ backgroundImage: `url(${articleImage})` }}>
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
				<img src={articleImage} alt="" />
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
