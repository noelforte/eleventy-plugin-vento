// Plugin option type declarations bundled with dist-package

import type { LiteralUnion } from 'type-fest';
import type * as ventojs from 'ventojs';
import { Plugin } from 'ventojs/core/environment.js';

export interface PluginOptions {
	/**
	 * An array of Vento plugins
	 */
	plugins?: Plugin[];
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
	autotrim?: LiteralUnion<'@11ty' | '@vento', string>[] | boolean;
	/** Enable use of Eleventy filters */
	filters?: boolean;
	/** Enable use of Eleventy shortcodes */
	shortcodes?: boolean;
	/** Enable use of Eleventy paired shortcodes */
	pairedShortcodes?: boolean;
	/**
	 * A Vento configuration object.
	 *
	 * **Note that `ventoOptions.includes` defaults to
	 * Eleventy's own `dir.includes` location.**
	 * @see {@link https://vento.js.org/configuration/}
	 */
	ventoOptions?: ventojs.Options;
}
