// Utility types to fill in gaps in Eleventy

import type _UserConfig from '@11ty/eleventy/UserConfig';
import type { MaybePromise } from './utilities.js';

export interface EleventyContext {
	page: Record<string, unknown>;
	eleventy: Record<string, string>;
}

export type EleventyDataCascade = EleventyContext & Record<string, unknown>;

export type EleventyFunction<Context = EleventyContext> = (
	this: Context,
	...args: unknown[]
) => MaybePromise<void | string>;

export type EleventyFunctionMap = Record<string, EleventyFunction>;

export type EleventyRenderFunction = (data: EleventyDataCascade) => MaybePromise<string>;

export interface UserConfig extends _UserConfig {
	directories: {
		input: string;
		output: string;
		includes: string;
		layouts: string;
	};
}
