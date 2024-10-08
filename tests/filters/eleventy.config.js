export default function eleventy(eleventyConfig) {
	eleventyConfig.addFilter('wrapWith', (content, tag = 'span') => `<${tag}>${content}</${tag}>`);

	eleventyConfig.addFilter('pageUrlCompare', function (url) {
		return this.page.url === url;
	});

	// Virtual templates
	const slugs = ['with-this-example-1', 'with-this-example-2'];

	for (const slug of slugs) {
		eleventyConfig.addTemplate(`${slug}.vto`, '{{ page.url |> pageUrlCompare }}');
	}
}
