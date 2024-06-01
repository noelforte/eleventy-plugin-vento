/**
 * @file Adds Vento support to eleventy.
 *
 * @typedef VentoPluginOptions
 * @prop {boolean} retrieveGlobals If true, uses
 * [`node-retrieve-globals`](https://www.npmjs.com/package/node-retrieve-globals)
 * to merge globals back into the Data Cascade outside of front matter.
 * @prop {Object<string,(...any) => any} filters An object containing methods that
 * will be loaded as filters into Vento.
 * @prop {import('ventojs').Options} ventoOptions Vento engine configuration object
 * that will be merged with default options.
 */

import path from 'node:path';

import { RetrieveGlobals } from 'node-retrieve-globals';
import VentoJs from 'ventojs';

/**
 * @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig
 * @param {VentoPluginOptions} options
 */
export function VentoPlugin(eleventyConfig, options = {}) {
	const { dir } = eleventyConfig;

	options = {
		retrieveGlobals: false,
		filters: {},
		ventoOptions: {
			includes: path.join(dir.input, dir.includes),
			autoescape: false,
		},
		...options,
	};

	const jsHelpers = eleventyConfig.javascriptFunctions;

	const env = VentoJs(options.ventoOptions);

	env.cache.clear();

	eleventyConfig.addTemplateFormats('vto');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',

		async compile(inputContent) {
			return async (data) => {
				for (const [name, callback] of Object.entries(jsHelpers)) {
					jsHelpers[name] = callback.bind(data);
				}

				Object.assign(data, jsHelpers);

				return env.runString(inputContent, data).then(({ content }) => content);
			};
		},

		async getData(inputPath) {
			if (!options.retrieveGlobals) return {};

			const { code } = await env.load(inputPath);

			const vm = new RetrieveGlobals(code);
			const globals = await vm.getGlobalContext({
				__exports: '',
				[options.ventoOptions?.dataVarname || 'it']: {},
			});

			return globals;
		},
	});
}
