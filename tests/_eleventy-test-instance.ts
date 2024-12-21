import Eleventy, { type UserConfig } from '@11ty/eleventy';

import path from 'node:path';
import fs from 'node:fs';

import { VentoPlugin } from '../src/plugin.js';
import type { PluginOptions } from '../src/types/options.js';

interface JsonResult {
	url: string | false;
	inputPath: string;
	outputPath: string | false;
	rawInput: string;
	content: string;
}

interface TestOptions {
	pluginOptions?: PluginOptions;
	eleventy?: ConstructorParameters<typeof Eleventy>[2];
}

class EleventyTest extends Eleventy {
	buildResults: JsonResult[] = [];

	constructor(inputPath: string, options: Partial<TestOptions> = {}) {
		const outputPath = path.join(inputPath, '_site');
		const maybeConfigPath = path.join(inputPath, 'eleventy.config.js');

		// Initialize parent class
		super(inputPath, outputPath, {
			...options.eleventy,

			quietMode: true,

			configPath: fs.existsSync(maybeConfigPath) ? maybeConfigPath : undefined,

			config(eleventyConfig: UserConfig) {
				eleventyConfig.addPlugin(VentoPlugin, options?.pluginOptions);
			},
		});
	}

	async rebuild() {
		const newResults = (await this.toJSON()) as unknown;
		this.buildResults = newResults as JsonResult[];
	}

	getBuildResultForUrl(url: string) {
		return this.buildResults.find((page) => page.url === url);
	}

	getPageWithInput(content: string) {
		return this.buildResults.find((page) => page.rawInput === content);
	}

	countResultPages(): number {
		return this.buildResults.filter(({ outputPath }) => Boolean(outputPath)).length;
	}
}

export { EleventyTest };
