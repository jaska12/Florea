import React from 'react';

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	/** slider arrows or a "see all" link, shown on the right **/
	children?: React.ReactNode;
}

const SectionHeader = (props: SectionHeaderProps) => {
	const { title, subtitle, children } = props;

	return (
		<div className={'section-header'}>
			<div className={'section-heading'}>
				<h2 className={'section-title'}>{title}</h2>
				{subtitle && <p className={'section-sub'}>{subtitle}</p>}
			</div>
			{children && <div className={'section-actions'}>{children}</div>}
		</div>
	);
};

export default SectionHeader;
