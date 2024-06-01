import { defineConfig } from '11ty.ts';
import { VentoPlugin } from '../../VentoPlugin.js';

export const config = {
	dir: {
		input: '.',
		output: '../output',
	},
};

export default defineConfig(async (eleventyConfig) => {
	eleventyConfig.addPlugin(VentoPlugin, {
		retrieveGlobals: true,
	});
});
