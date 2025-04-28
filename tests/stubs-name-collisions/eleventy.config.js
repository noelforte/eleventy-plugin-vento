/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function eleventy(eleventyConfig) {
	// Name collisions (https://github.com/noelforte/eleventy-plugin-vento/issues/220)
	eleventyConfig.addShortcode('letter', function (content) {
		return `<span class="letter">${content}</span>`;
	});

	eleventyConfig.addShortcode('stringletter', function (content) {
		return `<span class="stringletter">${content}</span>`;
	});

	eleventyConfig.addShortcode('letterstring', function (content) {
		return `<span class="letterstring">${content}</span>`;
	});

	eleventyConfig.addPairedShortcode('lettergroup', function (content) {
		return `<section class="lettergroup">${content}</section>`;
	});

	eleventyConfig.addPairedShortcode('groupletter', function (content) {
		return `<section class="groupletter">${content}</section>`;
	});
}
