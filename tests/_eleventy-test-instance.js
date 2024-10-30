/**
 * @typedef TestOptions
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} pluginOptions
 * @property {object} eleventy
 *
 * @typedef {{ url: string, inputPath: string, outputPath: string, rawInput: string, content: string }} PageObject
 */

import path from 'node:path';
import fs from 'node:fs';
import Eleventy from '@11ty/eleventy';
import { VentoPlugin } from 'eleventy-plugin-vento';

class EleventyTest extends Eleventy {
	/** @type {Promise<PageObject[]>} */
	buildResults;

	/**
	 * @param {string} inputPath
	 * @param {TestOptions} options
	 */
	constructor(inputPath, options = {}) {
		const outputPath = path.join(inputPath, '_site');
		const maybeConfigPath = path.join(inputPath, 'eleventy.config.js');

		// Initialize parent class
		super(inputPath, outputPath, {
			...options.eleventy,

			quietMode: true,

			configPath: fs.existsSync(maybeConfigPath) && maybeConfigPath,

			/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
			config(eleventyConfig) {
				eleventyConfig.addPlugin(VentoPlugin, options?.pluginOptions);
			},
		});
	}

	async rebuild() {
		this.buildResults = await this.toJSON();
		return this.buildResults;
	}

	/** @returns {Promise<PageObject|undefined>} */
	async getBuildResultForUrl(url) {
		this.buildResults ??= await this.rebuild();
		return this.buildResults.find((page) => page.url === url);
	}

	/** @returns {Promise<PageObject|undefined>} */
	async getPageWithInput(content) {
		this.buildResults ??= await this.rebuild();
		return this.buildResults.find((page) => page.rawInput === content);
	}

	async countResultPages() {
		this.buildResults ??= await this.rebuild();
		return this.buildResults.filter(({ outputPath }) => Boolean(outputPath)).length;
	}
}

export { EleventyTest };
