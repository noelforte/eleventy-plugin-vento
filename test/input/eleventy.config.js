import { VentoPlugin, ventoTrimDefaultTags } from 'eleventy-plugin-vento';

export const config = {
	dir: {
		input: '.',
		output: '../output',
	},
};

/** @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(VentoPlugin, {
		trimTags: [...ventoTrimDefaultTags.autoTrimDefaultTags, 'for'],
	});

	eleventyConfig.addShortcode('possumPosse', () => 'Release the possums!!!');
}
