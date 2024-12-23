// Vento library augmentations
import type { MergeDeep } from 'type-fest';
import type { Environment, Tag } from 'ventojs/src/environment.js';

import type { EleventyTagInfo, EleventyTag } from '../utils/create-vento-tag.ts';
import type { EleventyFunctionMap, EleventyDataCascade, EleventyFunction } from './eleventy.ts';

// Filter overrides
type EleventyVentoFilterThis = {
	data: EleventyDataCascade;
	env: EleventyVentoEnvironment;
};

type EleventyVentoFilter = EleventyFunction<EleventyVentoFilterThis>;

// Environment overrides
type VentoOverrides = {
	tags: (Tag | EleventyTag)[];
	filters: Record<string, EleventyVentoFilter>;
	utils: {
		eleventyFunctions: Record<EleventyTagInfo['group'], EleventyFunctionMap>;
		[K: string]: unknown;
	};
};

export type EleventyVentoEnvironment = MergeDeep<Environment, VentoOverrides>;

// Redeclare vento's default export declaration so we can use EleventyVentoEnvironment instead
declare module 'ventojs' {
	export default function (options: Options): EleventyVentoEnvironment;
}
