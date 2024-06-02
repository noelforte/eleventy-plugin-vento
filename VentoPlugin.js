/**
 * @file Adds Vento support to Eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {Object<string,(...any) => any} [filters={}] An object containing methods that
 * will be loaded as filters into Vento.
 * @prop {import('ventojs').Options} [ventoOptions] Vento engine configuration object
 * that will be merged with default options.
 * @prop {string|boolean} [addHelpers=true] Whether
 * [Javascript Functions](https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions)
 * should be merged into data provided to templates. If a string, functions will be namespaced under
 * a property with this name.
 */

import path from 'node:path';
import VentoJs from 'ventojs';

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
	const { dir, javascriptFunctions } = eleventyConfig;
	options = {
		addHelpers: true,
		filters: {},
		ventoOptions: {
			includes: path.join(dir.input, dir.includes),
			autoescape: false,
		},
		...options,
	};

	// Init vento
	const env = VentoJs(options.ventoOptions);

	// Load user-defined filters into vento
	for (const filter in options.filters) env.filters[filter] = options.filters[filter];

	eleventyConfig.on('eleventy.before', () => {
		env.cache.clear();
	});

	// Add vto as a template format and create a custom template for it
	eleventyConfig.addTemplateFormats('vto');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		async compile(inputContent, inputPath) {
			return async (data) => {
				if (options.addHelpers) {
					// Extract a possible namespace from the addHelpers option
					const namespace = options.addHelpers;

					// Rebind functions to page data so this.page, this.eleventy, etc works as intended
					const helpers = Object.assign(
						...Object.entries(javascriptFunctions).map(([name, fn]) => ({ [name]: fn.bind(data) }))
					);

					// Merge helpers into page data
					if (typeof namespace === 'string') data = { ...data, [namespace]: helpers };
					else data = { ...data, ...helpers };
				}

				return await env.runString(inputContent, data, inputPath).then((result) => result.content);
			};
		},
	});
}
