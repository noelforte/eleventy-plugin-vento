/**
 * @typedef TestOptions
 * @property {import('eleventy-plugin-vento').VentoPluginOptions} pluginOptions
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
	 * @param {string} inputPathname
	 * @param {TestOptions} options
	 */
	constructor(inputPathname, options) {
		const inputPath = path.resolve(import.meta.dirname, '..', inputPathname);
		const outputPath = path.resolve(inputPath, '_site');
		const maybeConfigPath = path.join(inputPath, 'eleventy.config.js');

		// Initialize parent class
		super(inputPath, outputPath, {
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

	async getBuildResultForUrl(url) {
		this.buildResults ??= await this.rebuild();
		return this.buildResults.find((page) => page.url === url);
	}

	async countResultPages() {
		this.buildResults ??= await this.rebuild();
		return this.buildResults.filter(({ outputPath }) => Boolean(outputPath)).length;
	}
}

export { EleventyTest };
