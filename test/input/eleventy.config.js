import { VentoPlugin } from '../../VentoPlugin.js';

export const config = {
	dir: {
		input: '.',
		output: '../output',
	},
};

/** @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig  */
export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(VentoPlugin, {
		retrieveGlobals: true,
	});
}
