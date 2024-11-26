/// <reference types="node" />

import type { Promisable } from 'type-fest';
import type { EleventyScope } from '11ty.ts';
import type { Options } from 'ventojs';
import type { Environment, Plugin } from 'ventojs/src/environment.js';

export type AutotrimConfig = boolean | ('@11ty' | '@vento' | (string & Record<never, never>))[];

export type EleventyContext = Partial<EleventyScope> & Record<string, unknown>;
export type PageData = EleventyContext & Record<string, unknown>;
export type EleventyFunction = (...args: unknown[]) => Promisable<string | void>;
export type EleventyFunctionMap = Record<string, EleventyFunction>;

export type EleventyVentoEnv = Environment & {
	utils: {
		eleventyFunctions: Record<TagSpec['group'], EleventyFunctionMap>;
		[x: string]: unknown;
	};
};

export interface TagSpec {
	name: string;
	group: 'shortcodes' | 'pairedShortcodes';
}

export interface VentoPluginOptions {
	/**
	 * An array of Vento plugins
	 */
	plugins: Plugin[];
	/**
	 * Enables Vento's autotrim plugin.
	 * ```js
	 * // Set to an array of tags
	 * autotrim: ['tag1', 'tag2']
	 *
	 * // Use Vento's defaults and Eleventy paired shortcodes
	 * // If set to `true`, uses both
	 * autotrim: ['@vento', '@11ty']
	 * autotrim: true
	 * ```
	 */
	autotrim: AutotrimConfig;
	/** Enable use of Eleventy filters */
	filters: boolean;
	/** Enable use of Eleventy shortcodes */
	shortcodes: boolean;
	/** Enable use of Eleventy paired shortcodes */
	pairedShortcodes: boolean;
	/**
	 * A Vento configuration object.
	 *
	 * **Note that `ventoOptions.includes` defaults to
	 * Eleventy's own `dir.includes` location.**
	 * @see {@link https://vento.js.org/configuration/}
	 */
	ventoOptions: Options;
}
