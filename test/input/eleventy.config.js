import { VentoPlugin } from 'eleventy-plugin-vento';
import autoTrim from 'ventojs/plugins/auto_trim.js';

export const config = {
	dir: {
		input: '.',
		output: '../output',
	},
};

/** @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(VentoPlugin, {
		filters: {
			italicize(content) {
				return `<em>${content}</em>`;
			},
		},
		plugins: [autoTrim()],
	});

	eleventyConfig.addShortcode('possumPosse', () => 'Release the possums!!!');
}
