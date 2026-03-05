// Utility types to fill in gaps in Eleventy

import type { EleventyScope } from '11ty.ts';
import type _UserConfig from '@11ty/eleventy/UserConfig';
import type { MaybePromise } from './utilities.js';

export interface EleventyDataCascade extends EleventyScope {
	[K: string]: unknown;
}

export type EleventyFunction<Context = EleventyScope> = (
	this: Context,
	...args: unknown[]
) => MaybePromise<void | string>;

export type EleventyFunctionMap = Record<string, EleventyFunction>;

export interface UserConfig extends _UserConfig {
	directories: {
		input: string;
		output: string;
		includes: string;
		layouts: string;
	};
}
