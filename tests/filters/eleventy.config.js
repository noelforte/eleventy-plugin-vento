export default function (eleventyConfig) {
	eleventyConfig.addFilter(
		'uppercase',
		/** @param {string} content */
		(content) => content.toUpperCase()
	);

	eleventyConfig.addFilter('wrapWith', (content, tag) => `<${tag}>${content}</${tag}>`);

	eleventyConfig.addFilter('pageUrlCompare', function (url) {
		return url === this.page.url;
	});
}
