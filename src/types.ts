/// <reference types="node" />

import type { EleventyScope } from '11ty.ts';
import type { Options } from 'ventojs';
import type { Plugin } from 'ventojs/src/environment.js';

export type { Tag, Environment } from 'ventojs/src/environment.js';

export type AutotrimConfig = boolean | ('@11ty' | '@vento' | (string & Record<never, never>))[];

export type EleventyContext = Partial<EleventyScope> & Record<string, unknown>;
export type PageData = EleventyContext & Record<string, unknown>;
export type EleventyFunction = (...args: unknown[]) => unknown;
export type EleventyFunctionMap = Record<string, EleventyFunction>;

export interface TagSpec {
	name: string;
	group: 'shortcodes' | 'pairedShortcodes';
}

export interface EleventyUtils {
	_11tyFns: {
		shortcodes: EleventyFunctionMap;
		pairedShortcodes: EleventyFunctionMap;
	};
	_11tyCtx: EleventyContext;
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
	 * Enable tag-ignore `{{! ... }}` syntax.
	 * @deprecated See https://github.com/noelforte/eleventy-plugin-vento/releases/tag/v3.3.0
	 */
	ignoreTag: boolean;
	/**
	 * A Vento configuration object.
	 *
	 * **Note that `ventoOptions.includes` defaults to
	 * Eleventy's own `dir.includes` location.**
	 * @see {@link https://vento.js.org/configuration/}
	 */
	ventoOptions: Options;
}
