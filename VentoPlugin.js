/**
 * @file Adds Vento support to Eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {Object<string,(...any) => any} filters An object containing methods that
 * will be loaded as filters into Vento.
 * @prop {import('ventojs').Options} ventoOptions Vento engine configuration object
 * that will be merged with default options.
 */

import path from 'node:path';
import VentoJs from 'ventojs';

/**
 * @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig
 * @param {VentoPluginOptions} options
 */
export function VentoPlugin(eleventyConfig, options = {}) {
	const { dir, javascriptFunctions } = eleventyConfig;
	const env = VentoJs(options.ventoOptions);

	options = {
		filters: {},
		ventoOptions: {
			includes: path.join(dir.input, dir.includes),
			autoescape: false,
		},
		...options,
	};

	for (const filter in options.filters) env.filters[filter] = options.filters[filter];

	env.cache.clear();

	eleventyConfig.addTemplateFormats('vto');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',

		async compile(inputContent) {
			return async (data) => {
				for (const jsHelper in javascriptFunctions) {
					data[jsHelper] = javascriptFunctions[jsHelper].bind(data);
				}

				return env.runString(inputContent, data).then(({ content }) => content);
			};
		},
	});
}
