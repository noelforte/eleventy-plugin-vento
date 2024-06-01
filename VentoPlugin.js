/**
 * @file Adds Vento {@link Vento https://vento.js.org/} support to eleventy.
 */

import path from 'node:path';
import debug from 'debug';

import { RetrieveGlobals } from 'node-retrieve-globals';
import VentoJs from 'ventojs';

/**
 * @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig
 */
export function VentoPlugin(eleventyConfig, pluginOptions = {}) {
	const { directories } = eleventyConfig;

	const env = VentoJs({
		includes: directories.includes,
	});

	const jsHelpers = eleventyConfig.javascriptFunctions;

	eleventyConfig.addTemplateFormats('vto');

	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',

		async compile(inputContent, inputPath) {
			env.cache.clear();
			const template = await env.load(inputPath);

			return async (data) => {
				for (const [name, callback] of Object.entries(jsHelpers)) {
					jsHelpers[name] = callback.bind(data);
				}

				Object.assign(data, jsHelpers);

				return env.runString(inputContent, data).then(({ content }) => content);
			};
		},

		async getData(inputPath) {
			const { code } = await env.load(inputPath);

			const vm = new RetrieveGlobals(code);
			const globals = await vm.getGlobalContext({ __exports: '', it: {} });

			return globals;
		},
	});
}
