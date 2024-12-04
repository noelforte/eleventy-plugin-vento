import type { Merge } from 'type-fest';
import type { Environment, Tag } from 'ventojs/src/environment.js';
import type { Token } from 'ventojs/src/tokenizer.js';

import type { EleventyTagInfo } from '../utils/create-vento-tag.ts';
import type { EleventyFunctionMap, EleventyDataCascade, EleventyFunction } from './eleventy.ts';

export type EleventyVentoEnvironment = Merge<Environment, VentoOverrides>;
type EleventyVentoFilter = EleventyFunction<EleventyVentoFilterThis>;

type VentoOverrides = {
	tags: (Tag | EleventyTag)[];
	filters: Record<string, EleventyVentoFilter>;
	utils: {
		eleventyFunctions: Record<EleventyTagInfo['group'], EleventyFunctionMap>;
		[K: string]: unknown;
	};
};

export type EleventyVentoFilterThis = {
	data: EleventyDataCascade;
	env: EleventyVentoEnvironment;
};

export type EleventyTag = (
	env: EleventyVentoEnvironment,
	code: string,
	output: string,
	tokens: Token[]
) => string | undefined;

declare module 'ventojs' {
	export default function (options: Options): Merge<Environment, VentoOverrides>;
}
