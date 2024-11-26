import type { VentoPluginOptions } from '../src/types.ts';
import type { UserConfig } from '@11ty/eleventy';

import Eleventy from '@11ty/eleventy';

interface JsonResult {
	url: string | false;
	inputPath: string;
	outputPath: string | false;
	rawInput: string;
	content: string;
}

interface TestOptions {
	pluginOptions?: Partial<VentoPluginOptions>;
	eleventy?: Partial<UserConfig>;
}

import path from 'node:path';
import fs from 'node:fs';
import { VentoPlugin } from '../src/plugin.js';

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
