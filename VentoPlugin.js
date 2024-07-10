/**
 * @file Adds support for the Vento templating language to Eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {Function[]} [plugins=[]] An array of plugins to load into vento.
 * @prop {boolean} [useEleventyFeatures=true]
 * Whether Eleventy features should be enabled in templates. If true, will create tags and filters
 * from Eleventy shortcodes and filters.
 * @prop {boolean|string[]} [trimTags=false] Whether to automatically trim tags from output. Uses Vento's
 * [autoTrim](https://vento.js.org/plugins/auto-trim/) plugin under the hood.
 * @prop {boolean} [useSsrPlugin=true] Whether to load the SSR-specific syntax into Vento.
 * If true, the `{{! ... }}` tag wont be removed from the output and instead kept as is. Helpful for
 * hybrid rendering of pre-rendered and server-side templates.
 * @prop {import('ventojs').Options} [ventoOptions] Vento engine configuration object
 * that will be merged with default options.
 */

import VentoJs from 'ventojs';
import { ssr } from '#lib/ssr.js';

// Expose autotrim plugin defaults
import {
	default as autoTrim,
	defaultTags as ventoDefaultTrimTags,
} from 'ventojs/plugins/auto_trim.js';
export { ventoDefaultTrimTags };

/**
 * @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig
 * @param {VentoPluginOptions} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions = {}) {
	if (!('addExtension' in eleventyConfig)) {
		console.log(
			`[eleventy-plugin-vento] WARN Eleventy plugin compatibility: Custom templates are required for this plugin, please use Eleventy v1.0 or newer.`
		);
	}

	/** @type {VentoPluginOptions} */
	const options = {
		// Define defaults
		trimTags: false,
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

	// Init vento
	const ventoEnv = VentoJs(options.ventoOptions);

	// Load user-defined plugins into vento
	for (const plugin of options.plugins) ventoEnv.use(plugin);

	// Load ssr plugin
	ventoEnv.use(ssr);

	// Add autotrim plugin if enabled
	if (userOptions.trimTags === true) ventoEnv.use(autoTrim());
	else if (userOptions.trimTags) ventoEnv.use(autoTrim({ tags: userOptions.trimTags }));

	eleventyConfig.on('eleventy.before', () => ventoEnv.cache.clear());

	// Add vto as a template format
	eleventyConfig.addTemplateFormats('vto');

	// Add vto extension handling
	eleventyConfig.addExtension('vto', {
		// Set output extension
		outputFileExtension: 'html',

		// Read vto files into eleventy
		read: true,

		// Main compile function
		async compile(inputContent, inputPath) {
			return async (data) => {
				if (options.useEleventyFeatures) {
					// Add context to filters
					for (const name in eleventyConfig.getFilters()) {
						const filter = eleventyConfig.getFilter(name);
						const filterWithContext = function (...args) {
							const fn = eleventyConfig.augmentFunctionContext(filter, {
								source: data,
								overwrite: false,
							});

							return fn(...args);
						};

						ventoEnv.filters[name] = filterWithContext;
					}
				}

				const result = await ventoEnv.runString(inputContent, data, inputPath);

				if (data.page?.rawInput !== inputContent) {
					env.cache.delete(inputPath);
				}

				return result.content;
			};
		},

		compileOptions: {
			// Custom permalink compilation
			permalink(linkContents) {
				if (typeof linkContents !== 'string') return linkContents;
				return async (data) => {
					const result = await ventoEnv.runString(linkContents, data);
					return result.content;
				};
			},
		},
	});
}
