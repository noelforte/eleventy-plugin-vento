import path from 'node:path';
import { existsSync } from 'node:fs';
import { VentoPlugin } from 'eleventy-plugin-vento';
import Eleventy from '@11ty/eleventy';

/**
 * @typedef TestOverrides
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} vento
 *
 * @typedef {{ url: string, inputPath: string, outputPath: string, rawInput: string, content: string }} PageObject
 * @typedef {PageObject[]} EleventyOutput
 */

/**
 * @param {string} fromInput
 * @param {TestOverrides} overrides
 */
export async function runBuild(fromInput, overrides) {
	const configPath = path.join(fromInput, 'eleventy.config.js');

	const instance = new Eleventy(fromInput, '_site', {
		quiet: true,

		configPath: existsSync(configPath) && configPath,

		/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
		config(eleventyConfig) {
			eleventyConfig.addPlugin(VentoPlugin, overrides?.vento);
			eleventyConfig.ignores.add('**/__snapshots__/**');
		},
	});

	/** @type {Promise<EleventyOutput>} */
	return instance.toJSON();
}
