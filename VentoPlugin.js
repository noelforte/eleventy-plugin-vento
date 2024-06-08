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

import path from 'node:path';
import VentoJs from 'ventojs';

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
	const { dir, javascriptFunctions, liquidFilters, nunjucksFilters, nunjucksAsyncFilters } =
		eleventyConfig;
	options = {
		addHelpers: true,
		trimTags: false,
		plugins: [],
		ventoOptions: {
			includes: path.join(dir.input, dir.includes),
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
	for (const filter in filters) {
		env.filters[filter] = filters[filter];
	}

	// Load user-defined plugins into vento
	for (const plugin of options.plugins) env.use(plugin);

	// Add autotrim plugin if enabled
	if (options.trimTags) env.use(autoTrim({ tags: options.trimTags || ventoDefaultTrimTags }));

	// Add vto as a template format and create a custom template for it
	eleventyConfig.addTemplateFormats('vto');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',

		async compile(inputContent, inputPath) {
			env.cache.clear();
			return async (data) => {
				if (options.addHelpers) {
					// Extract a possible namespace from the addHelpers option
					const namespace = options.addHelpers;

					// Rebind functions to page data so this.page, this.eleventy, etc works as intended
					for (const helper in helperFunctions) {
						helperFunctions[helper] = helperFunctions[helper].bind(data);
					}

					// Rebind filters the same way
					for (const filter in env.filters) {
						env.filters[filter] = env.filters[filter].bind(data);
					}

					// Merge helpers into page data
					if (typeof namespace === 'string') data = { ...data, [namespace]: helperFunctions };
					else data = { ...data, ...helperFunctions };
				}

				const result = await env.runString(inputContent, data, inputPath);

				return result.content;
			};
		},

		compileOptions: {
			permalink(linkContents, inputPath) {
				if (!linkContents) return linkContents;
				return async (data) => {
					const result = await env.runString(linkContents, data, inputPath);
					return result.content;
				};
			},
		},
	});
}
