/**
 * @file Adds support for the Vento templating language to Eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {Function[]} [plugins=[]] An array of plugins to load into vento.
 * @prop {boolean} [useEleventyFeatures=true]
 * Whether Eleventy features should be enabled in templates. If true, will create tags and filters
 * from Eleventy shortcodes and filters.
 * @prop {boolean|{tags: string[], extend: boolean}} [autotrim=false] Whether to automatically
 * trim tags from output. Uses Vento's [autoTrim](https://vento.js.org/plugins/auto-trim/) plugin under
 * the hood.
 * @prop {boolean} [useSsrPlugin=true] Whether to load the SSR-specific syntax into Vento.
 * If true, the `{{! ... }}` tag wont be removed from the output and instead kept as is. Helpful for
 * hybrid rendering of pre-rendered and server-side templates.
 * @prop {import('ventojs').Options} [ventoOptions] Vento engine configuration object
 * that will be merged with default options.
 */

import { VentoEngine } from './engine.js';

// Additional plugins
import { ssrPlugin } from './modules/ssr.js';
import {
	default as autotrimPlugin,
	defaultTags as autotrimDefaultTags,
} from 'ventojs/plugins/auto_trim.js';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {VentoPluginOptions} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions = {}) {
	eleventyConfig.versionCheck('>= 3.0.0-beta.1');

	/** @type {VentoPluginOptions} */
	const options = {
		// Define defaults
		autotrim: false,
		plugins: [],
		useSsrPlugin: true,
		useEleventyFeatures: true,
		ventoOptions: {
			includes: eleventyConfig.directories.includes,
			autoescape: false,
		},

		// Merge in user-provided options
		...userOptions,
	};

	// Add ssr plugin to plugin list
	if (options.useSsrPlugin) options.plugins.push(ssrPlugin);

	// Add autotrim plugin if enabled
	if (options.autotrim) {
		const tagSet = new Set(options.autotrim?.tags || autotrimDefaultTags);
		if (options.autotrim.extend) for (const tag of autotrimDefaultTags) tagSet.add(tag);
		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Start the vento engine instance
	const vento = new VentoEngine(options.ventoOptions);

	vento.emptyCache(); // Ensure cache is empty
	vento.loadPlugins(options.plugins); // Load plugin functions
	if (options.useEleventyFeatures) vento.loadFilters(eleventyConfig.getFilters()); // Load filters

	// Add vto as a template format
	eleventyConfig.addTemplateFormats('vto');

	// Add vto extension handling
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		// Main compile function
		async compile(inputContent, inputPath) {
			return async (data) => vento.process(data, inputContent, inputPath);
		},

		// Custom permalink compilation
		compileOptions: {
			permalink(linkContents) {
				if (typeof linkContents !== 'string') return linkContents;
				return async function (data) {
					return vento.process(data, linkContents);
				};
			},
		},
	});
}
