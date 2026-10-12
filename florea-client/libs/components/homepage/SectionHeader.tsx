import React from 'react';
import Link, { LinkProps } from 'next/link';

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	/** the "See all" link of the section; `label` says what it leads to, for screen readers **/
	seeAll?: { href: LinkProps['href']; label: string };
	/** slider arrows, shown after the link **/
	children?: React.ReactNode;
}

// Every homepage section starts with this: title and subtitle on the left, "See all" and arrows on the right.
const SectionHeader = (props: SectionHeaderProps) => {
	const { title, subtitle, seeAll, children } = props;

	return (
		<div className={'section-header'}>
			<div className={'section-heading'}>
				<h2 className={'section-title'}>{title}</h2>
				{subtitle && <p className={'section-sub'}>{subtitle}</p>}
			</div>
			{(seeAll || children) && (
				<div className={'section-actions'}>
					{seeAll && (
						<Link className={'text-link'} href={seeAll.href} aria-label={seeAll.label}>
							See all
						</Link>
					)}
					{children && <div className={'section-arrows'}>{children}</div>}
				</div>
			)}
		</div>
	);
};

export default SectionHeader;
