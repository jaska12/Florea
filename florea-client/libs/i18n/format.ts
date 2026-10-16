import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { languageTag } from './locale';

export type DateStyle = 'short' | 'medium' | 'long' | 'full';
export type DateValue = Date | string | number | null | undefined;

/** a date in digits with the whole year: "10/12/2026", "2026. 10. 12.", "12.10.2026" **/
const NUMERIC_DATE: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

// Prices are whole Korean won. They are written the Korean way in every language of the site: ₩59,000.
const WON = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 });

/** a price in won: "₩59,000" (the one price formatter of the site) **/
export const formatPrice = (value?: number | null): string => WON.format(Math.round(value ?? 0));

/** numbers, prices and dates written the way the chosen language writes them **/
export const formatters = (locale?: string) => {
	const tag = languageTag(locale);
	const whole = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 });
	// a missing value becomes an invalid date, which every formatter below shows as an empty text
	const toDate = (value: DateValue) => (value instanceof Date ? value : new Date(value ?? NaN));
	const valid = (value: Date) => !Number.isNaN(value.getTime());
	return {
		number: (value?: number | null): string => whole.format(value ?? 0),
		price: formatPrice,
		date: (value: DateValue, style: DateStyle = 'medium'): string => {
			const date = toDate(value);
			if (!valid(date)) return '';
			// the short style of Intl writes the year with two digits ("10/12/26"), which reads as a day or a month
			return new Intl.DateTimeFormat(tag, style === 'short' ? NUMERIC_DATE : { dateStyle: style }).format(date);
		},
		/** a date with its weekday and no year: "Tuesday, 13 October" **/
		weekday: (value: DateValue, withYear = false): string => {
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
		ago: (value: DateValue): string => {
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
		/** a short date with the time: "10/13/2026, 2:05 PM" **/
		dateTime: (value: DateValue): string => {
			const date = toDate(value);
			return valid(date) ? new Intl.DateTimeFormat(tag, { ...NUMERIC_DATE, hour: 'numeric', minute: '2-digit' }).format(date) : '';
		},
		/** the day and the month, without the year: "13 October" **/
		dayMonth: (value: DateValue): string => {
			const date = toDate(value);
			return valid(date) ? new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long' }).format(date) : '';
		},
		month: (value: DateValue): string => {
			const date = toDate(value);
			return valid(date) ? new Intl.DateTimeFormat(tag, { month: 'long' }).format(date) : '';
		},
		day: (value: DateValue): string => {
			const date = toDate(value);
			return valid(date) ? String(date.getDate()).padStart(2, '0') : '';
		},
		year: (value: DateValue): string => {
			const date = toDate(value);
			return valid(date) ? String(date.getFullYear()) : '';
		},
	};
};

export const useFormat = () => {
	const { locale } = useRouter();
	return useMemo(() => formatters(locale), [locale]);
};
