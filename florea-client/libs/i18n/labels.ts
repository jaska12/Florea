import { useCallback } from 'react';
import { useTranslation } from 'next-i18next';

/** the groups of enum values that have labels in common.json under "enum" **/
export type EnumGroup =
	| 'productType'
	| 'productOccasion'
	| 'productSize'
	| 'productStatus'
	| 'productLocation'
	| 'orderStatus'
	| 'memberType'
	| 'memberStatus'
	| 'notificationType'
	| 'noticeTopic'
	| 'noticeStatus'
	| 'articleCategory'
	| 'articleStatus'
	| 'cardTone';

/** FLOWER_BOX -> "Flower box": what is shown if a value has no label yet **/
const readable = (value: string): string => {
	const text = value.replace(/_/g, ' ').toLowerCase();
	return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * The label of an enum value in the chosen language. The stored values (BOUQUET, OUT_FOR_DELIVERY) do not change;
 * only what is shown does.
 */
export const useEnumLabel = () => {
	const { t } = useTranslation('common');
	return useCallback(
		(group: EnumGroup, value?: string | null): string =>
			value ? t(`enum.${group}.${value}`, { defaultValue: readable(value) }) : '',
		[t],
	);
};
