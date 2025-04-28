/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function eleventy(eleventyConfig) {
	// Name collisions (https://github.com/noelforte/eleventy-plugin-vento/issues/220)
	eleventyConfig.addShortcode('letter', (content) => `<span class="letter">${content}</span>`);

	eleventyConfig.addShortcode(
		'stringletter',
		(content) => `<span class="stringletter">${content}</span>`
	);

	eleventyConfig.addShortcode(
		'letterstring',
		(content) => `<span class="letterstring">${content}</span>`
	);

	eleventyConfig.addPairedShortcode(
		'lettergroup',
		(content) => `<section class="lettergroup">${content}</section>`
	);

	eleventyConfig.addPairedShortcode(
		'groupletter',
		(content) => `<section class="groupletter">${content}</section>`
	);
}
