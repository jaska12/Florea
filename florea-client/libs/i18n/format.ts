import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { languageTag } from './locale';

export type DateStyle = 'short' | 'medium' | 'long' | 'full';

/** numbers, prices and dates written the way the chosen language writes them **/
export const formatters = (locale?: string) => {
	const tag = languageTag(locale);
	const whole = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 });
	// prices are in US dollars in every language; only the way the number is written changes
	const money = new Intl.NumberFormat(tag, {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'narrowSymbol',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});
	const toDate = (value: Date | string | number) => (value instanceof Date ? value : new Date(value));
	const valid = (value: Date) => !Number.isNaN(value.getTime());
	return {
		number: (value?: number | null): string => whole.format(value ?? 0),
		price: (value?: number | null): string => money.format(value ?? 0),
		date: (value: Date | string | number, style: DateStyle = 'medium'): string => {
			const date = toDate(value);
			return valid(date) ? new Intl.DateTimeFormat(tag, { dateStyle: style }).format(date) : '';
		},
		/** a date with its weekday and no year: "Tuesday, 13 October" **/
		weekday: (value: Date | string | number, withYear = false): string => {
			const date = toDate(value);
			if (!valid(date)) return '';
			return new Intl.DateTimeFormat(tag, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				...(withYear ? { year: 'numeric' } : {}),
			}).format(date);
		},
		/** "3 hours ago", "yesterday", in the chosen language **/
		ago: (value: Date | string | number): string => {
			const date = toDate(value);
			if (!valid(date)) return '';
			const seconds = Math.round((date.getTime() - Date.now()) / 1000);
			const relative = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' });
			const steps: [Intl.RelativeTimeFormatUnit, number][] = [
				['year', 31536000],
				['month', 2592000],
				['week', 604800],
				['day', 86400],
				['hour', 3600],
				['minute', 60],
			];
			for (const [unit, size] of steps) {
				if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
			}
			return relative.format(0, 'second');
		},
		year: (value: Date | string | number): string => {
			const date = toDate(value);
			return valid(date) ? String(date.getFullYear()) : '';
		},
	};
};

export const useFormat = () => {
	const { locale } = useRouter();
	return useMemo(() => formatters(locale), [locale]);
};
