import React, { useRef } from 'react';

export interface HomeTab {
	key: string;
	label: string;
}

interface HomeTabsProps {
	/** used for the ids that tie each tab to its panel: `${name}-tab-${key}` and `${name}-panel-${key}` **/
	name: string;
	label: string;
	tabs: HomeTab[];
	active: string;
	onChange: (key: string) => void;
}

// The tab row of a homepage section. Left and right arrow keys move between the tabs.
const HomeTabs = (props: HomeTabsProps) => {
	const { name, label, tabs, active, onChange } = props;
	const listRef = useRef<HTMLDivElement>(null);

	/** HANDLERS **/
	const keyHandler = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
		let next = index;
		if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
		else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = tabs.length - 1;
		else return;

		e.preventDefault();
		onChange(tabs[next].key);
		listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	};

	return (
		<div className={'home-tabs'} role={'tablist'} aria-label={label} ref={listRef}>
			{tabs.map((tab, index) => {
				const selected = tab.key === active;
				return (
					<button
						type={'button'}
						role={'tab'}
						key={tab.key}
						id={`${name}-tab-${tab.key}`}
						className={selected ? 'home-tab active' : 'home-tab'}
						aria-selected={selected}
						aria-controls={`${name}-panel-${tab.key}`}
						tabIndex={selected ? 0 : -1}
						onClick={() => onChange(tab.key)}
						onKeyDown={(e) => keyHandler(e, index)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
};

export default HomeTabs;
