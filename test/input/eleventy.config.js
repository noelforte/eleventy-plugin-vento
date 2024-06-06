import { VentoPlugin, ventoTrimDefaultTags } from 'eleventy-plugin-vento';

export const config = {
	dir: {
		input: '.',
		output: '../output',
	},
};

/** @param {import('@11ty/eleventy/src/UserConfig.js').default} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.addFilter('italicize', (content) => `<em>${content}</em>`);

	eleventyConfig.addFilter('appendURL', function (content) {
		return `${content} ${this.page.url}`;
	});

	eleventyConfig.addPlugin(VentoPlugin, {
		trimTags: [...ventoTrimDefaultTags.autoTrimDefaultTags, 'for'],
	});

	eleventyConfig.addShortcode('possumPosse', () => 'Release the possums!!!');
}
