// Plugin option type declarations bundled with dist-package

import type { LiteralUnion } from 'type-fest';
import type * as ventojs from 'ventojs';
import { Plugin } from 'ventojs/core/environment.js';

export interface PluginOptions {
	/**
	 * An array of Vento plugins
	 */
	plugins: Plugin[];
	/**
	 * Enables Vento's autotrim plugin.
	 * @example
	 * // Set to an array of tags
	 * autotrim: ['tag1', 'tag2']
	 * @example
	 * // Use Vento's defaults and Eleventy paired shortcodes
	 * // Setting `true` is functionally equivalent to both
	 * // `@vento` and `@11ty` being present
	 * autotrim: ['@vento', '@11ty']
	 * autotrim: true
	 */
	autotrim: LiteralUnion<'@11ty' | '@vento', string>[] | boolean;
	/**
	 * Enable use of Eleventy filters
	 */
	filters: boolean;
	/**
	 * Enable use of Eleventy shortcodes
	 */
	shortcodes: boolean;
	/**
	 * Enable use of Eleventy paired shortcodes
	 */
	pairedShortcodes: boolean;
	/**
	 * A Vento configuration object.
	 * @see {@link https://vento.js.org/configuration/}
	 * @default
	 * {
	 *   // Defaults to Eleventy's own `includes` directory
	 *   includes: eleventyConfig.directories.includes
	 * }
	 */
	ventoOptions: ventojs.Options;
}
