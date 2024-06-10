import { VentoPlugin } from 'eleventy-plugin-vento';
import Eleventy from '@11ty/eleventy';

/**
 * @typedef {object} ExtensionsOptions
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} vento
 * @property {import('@11ty/eleventy/src/UserConfig.js')} eleventy
 *
 * @typedef {{ url: string, inputPath: string, outputPath: string, rawInput: string, content: string }} PageObject
 * @typedef {PageObject[]} EleventyOutput
 */

/**
 * @param {string} fromInput
 * @param {ExtensionsOptions} [extensions={}]
 */
export async function runBuild(fromInput, extensions = {}) {
	const instance = new Eleventy(fromInput, '_site', {
		quiet: true,

		/** @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig */
		config(eleventyConfig) {
			eleventyConfig.addPlugin(VentoPlugin, extensions.vento || {});

			eleventyConfig.ignores.add('**/__snapshots__/**');

			if (extensions.eleventy) extensions.eleventy.call(this, eleventyConfig);
		},
	});

	/** @type {Promise<EleventyOutput>} */
	const results = await instance.toJSON();

	return results;
}
