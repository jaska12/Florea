import { registerEnumType } from '@nestjs/graphql';

/** how a gift card message should sound **/
export enum AiCardTone {
	WARM = 'WARM',
	ROMANTIC = 'ROMANTIC',
	PLAYFUL = 'PLAYFUL',
	FORMAL = 'FORMAL',
}
registerEnumType(AiCardTone, {
	name: 'AiCardTone',
});

export enum AiLanguage {
	ENGLISH = 'ENGLISH',
	KOREAN = 'KOREAN',
	RUSSIAN = 'RUSSIAN',
	UZBEK = 'UZBEK',
}
registerEnumType(AiLanguage, {
	name: 'AiLanguage',
});
