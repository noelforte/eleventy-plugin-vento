/**
 * @file Adds support for the Vento templating language to Eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {Function[]} [plugins=[]] An array of plugins to load into vento.
 * @prop {string|boolean} [addHelpers=true]
 * Whether [Javascript Functions](https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions)
 * should be merged into data provided to templates. If a string, functions will be namespaced under
 * a property with this name.
 * @prop {boolean|string[]} [trimTags=false] Whether to automatically trim tags from output. Uses Vento's
 * [autoTrim](https://vento.js.org/plugins/auto-trim/) plugin under the hood.
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
 * @param {VentoPluginOptions} options
 */
export function VentoPlugin(eleventyConfig, options = {}) {
	if (!('addExtension' in eleventyConfig)) {
		console.log(
			`[eleventy-plugin-vento] WARN Eleventy plugin compatibility: Custom templates are required for this plugin, please use Eleventy v1.0 or newer.`
		);
	}

	// Pull some bits from eleventyConfig and merge user-options with defaults
	const { directories, javascriptFunctions, liquidFilters, nunjucksFilters, nunjucksAsyncFilters } =
		eleventyConfig;

	options = {
		addHelpers: true,
		trimTags: false,
		plugins: [],
		ventoOptions: {
			includes: directories.includes,
			autoescape: false,
		},
		...options,
	};

	// Init vento
	const env = VentoJs(options.ventoOptions);

	// Create empty sets to hold user defined functions
	const filters = {};
	const helperFunctions = {};

	for (const fn in javascriptFunctions) {
		if (liquidFilters[fn] && (nunjucksFilters[fn] || nunjucksAsyncFilters[fn])) {
			filters[fn] = javascriptFunctions[fn];
		} else {
			helperFunctions[fn] = javascriptFunctions[fn];
		}
	}

	// Load filters into vento
	for (const filter in filters) env.filters[filter] = filters[filter];

	// Load user-defined plugins into vento
	for (const plugin of options.plugins) env.use(plugin);

	// Load ssr plugin
	env.use(ssr);

	// Add autotrim plugin if enabled
	if (options.trimTags === true) env.use(autoTrim());
	else if (options.trimTags) env.use(autoTrim({ tags: options.trimTags }));

	eleventyConfig.on('eleventy.before', () => env.cache.clear());

	// Add vto as a template format and create a custom template for it
	eleventyConfig.addTemplateFormats('vto');
	eleventyConfig.addExtension('vto', {
		// Set output extension
		outputFileExtension: 'html',

		// Read vto files into eleventy
		read: true,

		// Main compile function
		async compile(inputContent, inputPath) {
			return async (data) => {
				if (options.addHelpers) {
					// Extract a possible namespace from the addHelpers option
					const namespace = options.addHelpers;

					// Extract page and eleventy values from data
					const { page, eleventy } = data;

					// Rebind functions to page data so this.page, this.eleventy, etc works as intended
					for (const helper in helperFunctions) {
						helperFunctions[helper] = helperFunctions[helper].bind({
							page,
							eleventy,
						});
					}

					// Rebind filters the same way
					for (const filter in filters) {
						env.filters[filter] = filters[filter].bind({ page, eleventy });
					}

					// Merge helpers into page data
					if (typeof namespace === 'string') data = { ...data, [namespace]: helperFunctions };
					else data = { ...data, ...helperFunctions };
				}

				const result = await env.runString(inputContent, data, inputPath);

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
					const result = await env.runString(linkContents, data);
					return result.content;
				};
			},
		},
	});
}
