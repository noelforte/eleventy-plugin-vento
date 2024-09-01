/**
 * @typedef TestOptions
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} pluginOptions
 * @property {boolean} useEleventyConfig
 *
 * @typedef {{ url: string, inputPath: string, outputPath: string, rawInput: string, content: string }} PageObject
 */

import path from 'node:path';
import Eleventy from '@11ty/eleventy';
import { VentoPlugin } from 'eleventy-plugin-vento';

class EleventyTest extends Eleventy {
	/** @type {Promise<PageObject[]>} */
	#_buildResults;

	/**
	 * @param {string} pathname
	 * @param {TestOptions} options
	 */
	constructor(pathname, options) {
		const inputPath = path.resolve(import.meta.dirname, pathname);
		const outputPath = path.resolve(inputPath, '_site');

		// Initialize parent class
		super(inputPath, outputPath, {
			quietMode: true,

			configPath: options?.useEleventyConfig && path.join(inputPath, 'eleventy.config.js'),

			/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
			config(eleventyConfig) {
				eleventyConfig.addPlugin(VentoPlugin, options?.pluginOptions);
			},
		});

		// Perform a build
		this.#_buildResults = this.toJSON();
	}

	async getBuildResultForUrl(url) {
		const results = await this.#_buildResults;
		return results.find((page) => page.url === url);
	}

	async countResultPages() {
		const results = await this.#_buildResults;
		return results.filter(({ outputPath }) => Boolean(outputPath)).length;
	}
}

export { EleventyTest };
