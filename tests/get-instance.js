import path from 'node:path';
import { existsSync } from 'node:fs';
import { VentoPlugin } from 'eleventy-plugin-vento';
import Eleventy from '@11ty/eleventy';

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig.js').default} EleventyUserConfig
 *
 * @typedef {object} ExtensionsOptions
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} vento
 * @property {(configApi: EleventyUserConfig) => void} eleventy
 *
 * @typedef {{ url: string, inputPath: string, outputPath: string, rawInput: string, content: string }} PageObject
 * @typedef {PageObject[]} EleventyOutput
 */

/**
 * @param {string} fromInput
 * @param {ExtensionsOptions} [extensions={}]
 */
export async function runBuild(fromInput, extensions = {}) {
	const configPath = path.join(fromInput, 'eleventy.config.js');

	const instance = new Eleventy(fromInput, '_site', {
		quiet: true,

		configPath: existsSync(configPath) && configPath,

		/** @param {EleventyUserConfig} eleventyConfig */
		config(eleventyConfig) {
			eleventyConfig.addPlugin(VentoPlugin, extensions.vento || {});

			eleventyConfig.ignores.add('**/__snapshots__/**');
		},
	});

	/** @type {Promise<EleventyOutput>} */
	const results = await instance.toJSON();

	return results;
}
