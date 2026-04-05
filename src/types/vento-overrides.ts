// Type augmentations for Vento that eleventy-plugin-vento utilizes

import type { Environment, Tag } from 'ventojs/core/environment.js';

import type { EleventyTag, EleventyTagInfo } from '../utils/create-vento-tag.ts';
import type { EleventyDataCascade, EleventyFunction } from './eleventy.ts';

// Filter overrides
type EleventyVentoFilterThis = {
	data: EleventyDataCascade;
	env: EleventyVentoEnvironment;
};

type EleventyVentoFilter = EleventyFunction<EleventyVentoFilterThis>;

// Environment overrides
declare class VentoOverrides {
	tags: (Tag | EleventyTag)[];
	filters: Record<string, EleventyVentoFilter>;
	utils: {
		eleventyFunctions?: Map<`${EleventyTagInfo['group']}:${string}`, EleventyFunction>;
		[K: string]: unknown;
	};
}

export type EleventyVentoEnvironment = Omit<Environment, keyof VentoOverrides> & VentoOverrides;

// Redeclare vento's default export declaration so we can use EleventyVentoEnvironment instead
declare module 'ventojs' {
	export default function (options?: Options): EleventyVentoEnvironment;
}
